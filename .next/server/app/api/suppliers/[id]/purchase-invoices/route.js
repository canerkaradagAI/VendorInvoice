"use strict";(()=>{var i={};i.id=943,i.ids=[943],i.modules={399:i=>{i.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},517:i=>{i.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},8893:i=>{i.exports=require("buffer")},4770:i=>{i.exports=require("crypto")},7702:i=>{i.exports=require("events")},2048:i=>{i.exports=require("fs")},2615:i=>{i.exports=require("http")},8791:i=>{i.exports=require("https")},8216:i=>{i.exports=require("net")},9801:i=>{i.exports=require("os")},5315:i=>{i.exports=require("path")},6162:i=>{i.exports=require("stream")},2452:i=>{i.exports=require("tls")},7360:i=>{i.exports=require("url")},1568:i=>{i.exports=require("zlib")},9485:(i,e,t)=>{t.r(e),t.d(e,{originalPathname:()=>R,patchFetch:()=>v,requestAsyncStorage:()=>l,routeModule:()=>_,serverHooks:()=>m,staticGenerationAsyncStorage:()=>E});var s={};t.r(s),t.d(s,{GET:()=>d});var a=t(9303),n=t(8716),r=t(670),p=t(7070),o=t(8555),u=t(3377),c=t(9665);async function d(i,{params:e}){try{let t=parseInt(e.id),{searchParams:s}=new URL(i.url),a=s.get("productCode")||void 0,n=s.get("unitPrice")||void 0,r=s.get("quantity")||void 0;if(isNaN(t))return p.NextResponse.json({success:!1,error:"Ge\xe7ersiz tedarik\xe7i ID"},{status:400});let d=await (0,o.r7)(t,a);if(0===d.length){if(n&&r&&a){let i=parseFloat(n),e=parseInt(r);if(!isNaN(i)&&!isNaN(e)&&i>0){let s=new Date().toISOString().split("T")[0],n=[{id:0,invoice_number:"MEVCUT FİYAT",supplier_id:t,invoice_date:s,total_amount:i*e,created_at:s,items:[{id:0,invoice_id:0,product_code:a,quantity:e,unit_price:i,total_price:i*e}]}];return p.NextResponse.json({success:!0,data:n})}}return p.NextResponse.json({success:!0,data:[]})}let _=d.map(i=>i.id),l=[];if(_.length>0){let i=_.map((i,e)=>`$${e+1}`).join(","),e=`SELECT * FROM purchase_invoice_items WHERE invoice_id IN (${i}) ORDER BY invoice_id`;l=(await c.i6.query(e,_)).rows}let E=d.map(i=>({...i,items:l.filter(e=>e.invoice_id===i.id)}));if(a){let i=(0,u.rv)(a);E=E.filter(e=>e.items.some(e=>{let t=(0,u.rv)(e.product_code);return t===i||t.startsWith(i.split("-")[0]+"-")}))}let m=E.reduce((i,e)=>{let t=e.items.find(i=>{let e=(0,u.rv)(i.product_code),t=a?(0,u.rv)(a):"";return e===t||t&&e.startsWith(t.split("-")[0]+"-")});return i+(t?t.quantity:0)},0),R=r?parseInt(r):0;if(n&&a&&R>0){let i=parseFloat(n);if(!isNaN(i)&&i>0){if(0===E.length){let e=new Date().toISOString().split("T")[0];E=[{id:0,invoice_number:"MEVCUT FİYAT",supplier_id:t,invoice_date:e,total_amount:i*R,created_at:e,items:[{id:0,invoice_id:0,product_code:a,quantity:R,unit_price:i,total_price:i*R}]}],console.log("[API] Sanal fatura oluşturuldu (hi\xe7 fatura yok):",{productCode:a,unitPrice:i,quantity:R,total:i*R})}else if(m<R){let e=R-m,s=new Date().toISOString().split("T")[0];E.push({id:0,invoice_number:"MEVCUT FİYAT (Eksik Tamamlama)",supplier_id:t,invoice_date:s,total_amount:i*e,created_at:s,items:[{id:0,invoice_id:0,product_code:a,quantity:e,unit_price:i,total_price:i*e}]}),console.log("[API] Sanal fatura eklendi (eksik tamamlama):",{productCode:a,unitPrice:i,missingQuantity:e,totalAvailableQuantity:m,requiredQuantity:R,total:i*e})}}}return p.NextResponse.json({success:!0,data:E})}catch(i){return console.error("[api/suppliers/[id]/purchase-invoices] Hata:",i),p.NextResponse.json({success:!1,error:"Tedarik\xe7i satış faturaları alınamadı"},{status:500})}}let _=new a.AppRouteRouteModule({definition:{kind:n.x.APP_ROUTE,page:"/api/suppliers/[id]/purchase-invoices/route",pathname:"/api/suppliers/[id]/purchase-invoices",filename:"route",bundlePath:"app/api/suppliers/[id]/purchase-invoices/route"},resolvedPagePath:"C:\\Users\\caner.karadag\\Cursor_Projeler\\Tedarikci_Irsaliye\\app\\app\\api\\suppliers\\[id]\\purchase-invoices\\route.ts",nextConfigOutput:"",userland:s}),{requestAsyncStorage:l,staticGenerationAsyncStorage:E,serverHooks:m}=_,R="/api/suppliers/[id]/purchase-invoices/route";function v(){return(0,r.patchFetch)({serverHooks:m,staticGenerationAsyncStorage:E})}},8555:(i,e,t)=>{t.d(e,{Kv:()=>E,Vs:()=>l,Z$:()=>_,b_:()=>u,cu:()=>r,dr:()=>R,ny:()=>c,r7:()=>m,rH:()=>n,sA:()=>d,v$:()=>o,yV:()=>p});var s=t(9665),a=t(3377);async function n(i){if(null!=i&&""!==i){let e="string"==typeof i?parseInt(i):i;if(!isNaN(e))return(await (0,s.i6)`SELECT * FROM suppliers WHERE company_id = ${e} ORDER BY supplier_name`).rows}return(await (0,s.i6)`SELECT * FROM suppliers ORDER BY supplier_name`).rows}async function r(i){return(await (0,s.i6)`SELECT * FROM suppliers WHERE id = ${i}`).rows[0]||null}async function p(i={}){let{shippingNumber:e,status:t,supplierCode:n,companyId:r,page:p=1,limit:o=10}=i,u=[],c=[],d=1;if(e&&(u.push(`sd.shipping_number LIKE $${d}`),c.push(`%${e}%`),d++),t&&"all"!==t){let i=(0,a.iX)(t);u.push(`sd.status = $${d}`),c.push(i),d++}n&&(u.push(`s.supplier_code = $${d}`),c.push(n),d++),r&&(u.push(`s.company_id = $${d}`),c.push(r),d++);let _=u.length>0?`WHERE ${u.join(" AND ")}`:"",l=`
    SELECT COUNT(DISTINCT sd.id) as count
    FROM shipping_documents sd
    JOIN suppliers s ON s.id = sd.supplier_id
    LEFT JOIN companies c ON c.id = s.company_id
    ${_}
  `,E=await s.i6.query(l,c),m=parseInt(E.rows[0]?.count||"0"),R=`
    SELECT sd.id,
            sd.shipping_number,
            sd.supplier_id,
            sd.shipping_date,
            sd.total_amount,
            sd.item_count,
            sd.status,
            sd.notes,
            sd.created_at,
            sd.updated_at,
            s.supplier_name, 
            s.supplier_code, 
            s.id as supplier_id, 
            s.company_id, 
            c.company_name,
            i.invoice_number,
            COALESCE(SUM(si.quantity), 0) as total_quantity
     FROM shipping_documents sd
     JOIN suppliers s ON s.id = sd.supplier_id
     LEFT JOIN companies c ON c.id = s.company_id
     LEFT JOIN shipping_items si ON si.shipping_id = sd.id
     LEFT JOIN invoices i ON i.shipping_id = sd.id
     ${_}
     GROUP BY sd.id, sd.shipping_number, sd.supplier_id, sd.shipping_date, sd.total_amount, sd.item_count, sd.status, sd.notes, sd.created_at, sd.updated_at, s.supplier_name, s.supplier_code, s.id, s.company_id, c.company_name, i.invoice_number
     ORDER BY sd.created_at DESC LIMIT $${d} OFFSET $${d+1}
  `;return{data:(await s.i6.query(R,[...c,o,(p-1)*o])).rows,total:m}}async function o(i){return(await (0,s.i6)`SELECT * FROM shipping_documents WHERE id = ${i}`).rows[0]||null}async function u(i){return(await (0,s.i6)`SELECT * FROM shipping_items WHERE shipping_id = ${i}`).rows}async function c(i){let{shipping_id:e,status:t,total_amount:n}=i,r=(0,a.iX)(t);"number"==typeof n?await (0,s.i6)`
      UPDATE shipping_documents 
      SET status = ${r}, total_amount = ${n}, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ${e}
    `:await (0,s.i6)`
      UPDATE shipping_documents 
      SET status = ${r}, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ${e}
    `}async function d(i={}){let{search:e,status:t,page:a=1,limit:n=10}=i,r=[],p=[],o=1;e&&(r.push(`(invoice_number LIKE $${o} OR notes LIKE $${o+1})`),p.push(`%${e}%`,`%${e}%`),o+=2),t&&"all"!==t&&(r.push(`status = $${o}`),p.push(t),o++);let u=r.length>0?`WHERE ${r.join(" AND ")}`:"",c=`SELECT COUNT(*) as count FROM invoices ${u}`,d=await s.i6.query(c,p),_=parseInt(d.rows[0]?.count||"0"),l=`
    SELECT * FROM invoices 
    ${u} 
    ORDER BY created_at DESC 
    LIMIT $${o} OFFSET $${o+1}
  `;return{data:(await s.i6.query(l,[...p,n,(a-1)*n])).rows,total:_}}async function _(i){let e=await (0,s.i6)`SELECT COUNT(*) as count FROM invoices WHERE invoice_number LIKE '1-R-7-%'`,t=parseInt(e.rows[0]?.count||"0")+1,n=`1-R-7-${t.toString().padStart(3,"0")}`,r=(await (0,s.i6)`
    INSERT INTO invoices (invoice_number, shipping_id, invoice_type, base_amount, tax_amount, discount_amount, total_amount, created_date, due_date, status)
    VALUES (${n}, ${i.shipping_id}, ${i.invoice_type}, ${i.base_amount}, ${i.tax_amount}, ${i.discount_amount}, ${i.total_amount}, ${i.created_date}, ${i.due_date}, 'created')
    RETURNING *
  `).rows[0],p=(0,a.iX)("invoiced");return await (0,s.i6)`
    UPDATE shipping_documents 
    SET status = ${p}, total_amount = ${i.total_amount}, updated_at = CURRENT_TIMESTAMP 
    WHERE id = ${i.shipping_id}
  `,r}async function l(i){return(await (0,s.i6)`
    INSERT INTO price_calculations (shipping_id, invoice_type, calculated_price, base_amount, tax_amount, discount_amount, calculation_method, calculation_details)
    VALUES (${i.shipping_id}, ${i.invoice_type}, ${i.calculated_price}, ${i.base_amount}, ${i.tax_amount}, ${i.discount_amount}, ${i.calculation_method||null}, ${i.calculation_details||null})
    RETURNING *
  `).rows[0]}async function E(i){return(await (0,s.i6)`
    SELECT * FROM price_calculations 
    WHERE shipping_id = ${i} 
    ORDER BY created_at DESC 
    LIMIT 1
  `).rows[0]||null}async function m(i,e){if(e){let t=(0,a.rv)(e),n=await (0,s.i6)`
      SELECT DISTINCT pi.*
      FROM purchase_invoices pi
      WHERE pi.supplier_id = ${i}
      AND EXISTS (
        SELECT 1 FROM purchase_invoice_items pii
        WHERE pii.invoice_id = pi.id 
        AND UPPER(REPLACE(REPLACE(pii.product_code, ' ', '-'), '  ', '-')) = ${t}
      )
      ORDER BY pi.invoice_date DESC
    `;if(0===n.rows.length){let e=t.split("-")[0];e&&e!==t&&(n=await (0,s.i6)`
          SELECT DISTINCT pi.*
          FROM purchase_invoices pi
          WHERE pi.supplier_id = ${i}
          AND EXISTS (
            SELECT 1 FROM purchase_invoice_items pii
            WHERE pii.invoice_id = pi.id 
            AND UPPER(REPLACE(REPLACE(pii.product_code, ' ', '-'), '  ', '-')) LIKE ${e+"-%"}
          )
          ORDER BY pi.invoice_date DESC
        `)}return n.rows}return(await (0,s.i6)`
    SELECT DISTINCT pi.*
    FROM purchase_invoices pi
    WHERE pi.supplier_id = ${i}
    ORDER BY pi.invoice_date DESC
  `).rows}async function R(i,e,t){let n=(0,a.rv)(e),r=await (0,s.i6)`
    SELECT pi.id, pi.invoice_number, pi.invoice_date, pii.quantity, pii.unit_price
    FROM purchase_invoices pi
    JOIN purchase_invoice_items pii ON pii.invoice_id = pi.id
    WHERE pi.supplier_id = ${i} 
    AND UPPER(REPLACE(REPLACE(pii.product_code, ' ', '-'), '  ', '-')) = ${n}
    ORDER BY pi.invoice_date DESC, pi.id DESC
  `;if(0===r.rows.length){let e=n.split("-")[0];e&&e!==n&&(r=await (0,s.i6)`
        SELECT pi.id, pi.invoice_number, pi.invoice_date, pii.quantity, pii.unit_price
        FROM purchase_invoices pi
        JOIN purchase_invoice_items pii ON pii.invoice_id = pi.id
        WHERE pi.supplier_id = ${i} 
        AND UPPER(REPLACE(REPLACE(pii.product_code, ' ', '-'), '  ', '-')) LIKE ${e+"-%"}
        ORDER BY pi.invoice_date DESC, pi.id DESC
      `)}let p=r.rows,o=[],u=t;for(let i of p){if(u<=0)break;let e=Math.min(u,parseInt(i.quantity));e>0&&(o.push({invoiceId:i.id,invoiceNumber:i.invoice_number,invoiceDate:i.invoice_date,quantity:e,unitPrice:parseFloat(i.unit_price),total:e*parseFloat(i.unit_price)}),u-=e)}return o}},3377:(i,e,t)=>{function s(i){return i?i.trim().replace(/\s+/g,"-").toUpperCase():""}function a(i){switch(i){case"calculated":return"approved";case"invoiced":return"rejected";default:return"pending"}}t.d(e,{iX:()=>a,rv:()=>s})}};var e=require("../../../../../webpack-runtime.js");e.C(i);var t=i=>e(e.s=i),s=e.X(0,[276,64],()=>t(9485));module.exports=s})();