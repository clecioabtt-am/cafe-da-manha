const JSON_HEADERS={"Content-Type":"application/json; charset=utf-8"};
const json=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:JSON_HEADERS});
function isAdmin(request,env){return (request.headers.get("X-Admin-User")||"")===(env.ADMIN_USER||"admin")&&(request.headers.get("X-Admin-Password")||"")===(env.ADMIN_PASSWORD||"admin123");}

async function createOrder(request,env){
  const body=await request.json().catch(()=>null);
  if(!body?.customer_name||!Array.isArray(body.items)||!body.items.length)return json({error:"Dados do pedido inválidos."},400);
  const ids=[...new Set(body.items.map(i=>Number(i.menu_item_id)).filter(Boolean))];
  const marks=ids.map(()=>"?").join(",");
  const {results:rows}=await env.DB.prepare(`SELECT id,name,price FROM menu_items WHERE active=1 AND id IN (${marks})`).bind(...ids).all();
  const map=new Map(rows.map(r=>[Number(r.id),r]));let total=0;const normalized=[];
  for(const item of body.items){const id=Number(item.menu_item_id),qty=Math.max(1,Math.min(99,Number(item.quantity||1)));const p=map.get(id);if(!p)continue;total+=Number(p.price)*qty;normalized.push({id,qty,price:Number(p.price)});}
  if(!normalized.length)return json({error:"Itens não encontrados."},400);
  const number=String(Date.now()).slice(-6);const table=String(body.table_number||"").trim().slice(0,12)||null;
  const result=await env.DB.prepare(`INSERT INTO orders(order_number,customer_name,table_number,note,total,status) VALUES(?,?,?,?,?,'Novo')`).bind(number,String(body.customer_name).trim().slice(0,120),table,String(body.note||"").trim().slice(0,500),total).run();
  const orderId=result.meta.last_row_id;
  await env.DB.batch(normalized.map(i=>env.DB.prepare(`INSERT INTO order_items(order_id,menu_item_id,quantity,unit_price) VALUES(?,?,?,?)`).bind(orderId,i.id,i.qty,i.price)));
  return json({ok:true,order_id:orderId,order_number:number,total},201);
}

async function publicOrders(env){
  const {results}=await env.DB.prepare(`SELECT order_number,customer_name,table_number,status,created_at FROM orders WHERE date(created_at)=date('now') AND (status!='Concluído' OR datetime(updated_at)>=datetime('now','-10 minutes')) ORDER BY id ASC LIMIT 120`).all();
  return json({orders:results.map(row=>({order_number:row.order_number,customer_name:String(row.customer_name||'Cliente').trim().split(/\s+/)[0].slice(0,30),table_number:row.table_number||null,status:row.status,created_at:row.created_at}))});
}

async function adminOrders(request,env){
  if(!isAdmin(request,env))return json({error:"Não autorizado."},401);
  const url=new URL(request.url),search=(url.searchParams.get("search")||"").trim();let sql=`SELECT id,order_number,customer_name,table_number,note,total,status,created_at FROM orders`;const binds=[];
  if(search){sql+=` WHERE customer_name LIKE ? OR order_number LIKE ? OR table_number LIKE ?`;binds.push(`%${search}%`,`%${search}%`,`%${search}%`);}sql+=` ORDER BY id DESC LIMIT 300`;
  const stmt=env.DB.prepare(sql);const {results:orders}=binds.length?await stmt.bind(...binds).all():await stmt.all();await attachItems(orders,env);
  const s=await env.DB.prepare(`SELECT COUNT(*) orders,SUM(CASE WHEN status='Novo' THEN 1 ELSE 0 END) new,SUM(CASE WHEN status='Em preparo' THEN 1 ELSE 0 END) preparing,COALESCE(SUM(total),0) revenue FROM orders`).first();
  return json({orders,stats:{orders:Number(s.orders||0),new:Number(s.new||0),preparing:Number(s.preparing||0),revenue:Number(s.revenue||0)}});
}
async function attachItems(orders,env){if(!orders.length)return;const ids=orders.map(o=>o.id),marks=ids.map(()=>"?").join(",");const {results:items}=await env.DB.prepare(`SELECT oi.order_id,oi.quantity,mi.name FROM order_items oi JOIN menu_items mi ON mi.id=oi.menu_item_id WHERE oi.order_id IN (${marks}) ORDER BY oi.id`).bind(...ids).all();const grouped=new Map();for(const i of items){if(!grouped.has(i.order_id))grouped.set(i.order_id,[]);grouped.get(i.order_id).push(i);}orders.forEach(o=>o.items=grouped.get(o.id)||[]);}

async function report(request,env){
  if(!isAdmin(request,env))return json({error:"Não autorizado."},401);const period=new URL(request.url).searchParams.get("period")||"daily";
  let where,label;if(period==="weekly"){where=`datetime(created_at)>=datetime('now','-6 days','start of day')`;label="Últimos 7 dias";}else if(period==="monthly"){where=`strftime('%Y-%m',created_at)=strftime('%Y-%m','now')`;label="Mês atual";}else{where=`date(created_at)=date('now')`;label="Hoje";}
  const {results:orders}=await env.DB.prepare(`SELECT id,order_number,customer_name,table_number,note,total,status,created_at FROM orders WHERE ${where} ORDER BY id ASC`).all();await attachItems(orders,env);
  const revenue=orders.reduce((s,o)=>s+Number(o.total||0),0);return json({period,period_label:label,orders,summary:{orders:orders.length,revenue}});
}
async function getSettings(env){try{const row=await env.DB.prepare(`SELECT value FROM site_settings WHERE key='logo_data'`).first();return json({logo_data:row?.value||""});}catch(e){return json({logo_data:""});}}
async function setLogo(request,env){if(!isAdmin(request,env))return json({error:"Não autorizado."},401);const b=await request.json().catch(()=>null);const logo=String(b?.logo_data||"");if(!/^data:image\/(png|jpeg|webp|gif);base64,/i.test(logo))return json({error:"Formato de imagem inválido."},400);if(logo.length>1250000)return json({error:"Logo muito grande."},413);await env.DB.prepare(`INSERT INTO site_settings(key,value,updated_at) VALUES('logo_data',?,CURRENT_TIMESTAMP) ON CONFLICT(key) DO UPDATE SET value=excluded.value,updated_at=CURRENT_TIMESTAMP`).bind(logo).run();return json({ok:true});}
async function removeLogo(request,env){if(!isAdmin(request,env))return json({error:"Não autorizado."},401);await env.DB.prepare(`DELETE FROM site_settings WHERE key='logo_data'`).run();return json({ok:true});}

export default{async fetch(request,env){const url=new URL(request.url),path=url.pathname;
  if(path==="/api/orders"&&request.method==="POST")return createOrder(request,env);
  if(path==="/api/public/orders"&&request.method==="GET")return publicOrders(env);
  if(path==="/api/settings"&&request.method==="GET")return getSettings(env);
  if(path==="/api/admin/login"&&request.method==="POST"){const b=await request.json().catch(()=>({}));return (b.user===(env.ADMIN_USER||"admin")&&b.password===(env.ADMIN_PASSWORD||"admin123"))?json({ok:true}):json({error:"Credenciais inválidas."},401);}
  if(path==="/api/admin/orders"&&request.method==="GET")return adminOrders(request,env);
  if(path==="/api/admin/report"&&request.method==="GET")return report(request,env);
  if(path==="/api/admin/settings/logo"&&request.method==="PUT")return setLogo(request,env);
  if(path==="/api/admin/settings/logo"&&request.method==="DELETE")return removeLogo(request,env);
  const m=path.match(/^\/api\/admin\/orders\/(\d+)$/);
  if(m&&request.method==="PATCH"){if(!isAdmin(request,env))return json({error:"Não autorizado."},401);const b=await request.json().catch(()=>null);if(!["Novo","Em preparo","Pronto","Concluído"].includes(b?.status))return json({error:"Status inválido."},400);await env.DB.prepare(`UPDATE orders SET status=?,updated_at=CURRENT_TIMESTAMP WHERE id=?`).bind(b.status,Number(m[1])).run();return json({ok:true});}
  if(m&&request.method==="DELETE"){if(!isAdmin(request,env))return json({error:"Não autorizado."},401);await env.DB.prepare(`DELETE FROM orders WHERE id=?`).bind(Number(m[1])).run();return json({ok:true});}
  return env.ASSETS.fetch(request);
}};
