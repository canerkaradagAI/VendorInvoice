"use strict";(()=>{var i={};i.id=631,i.ids=[631],i.modules={399:i=>{i.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},517:i=>{i.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},8893:i=>{i.exports=require("buffer")},4770:i=>{i.exports=require("crypto")},7702:i=>{i.exports=require("events")},2048:i=>{i.exports=require("fs")},2615:i=>{i.exports=require("http")},8791:i=>{i.exports=require("https")},8216:i=>{i.exports=require("net")},9801:i=>{i.exports=require("os")},5315:i=>{i.exports=require("path")},6162:i=>{i.exports=require("stream")},2452:i=>{i.exports=require("tls")},7360:i=>{i.exports=require("url")},1568:i=>{i.exports=require("zlib")},4736:(i,e,t)=>{t.r(e),t.d(e,{originalPathname:()=>l,patchFetch:()=>R,requestAsyncStorage:()=>d,routeModule:()=>c,serverHooks:()=>_,staticGenerationAsyncStorage:()=>E});var s={};t.r(s),t.d(s,{GET:()=>o});var a=t(9303),n=t(8716),p=t(670),r=t(7070),u=t(8555);async function o(i,{params:e}){try{let i=parseInt(e.id);if(isNaN(i))return r.NextResponse.json({success:!1,error:"Ge\xe7ersiz irsaliye ID"},{status:400});let t=await (0,u.b_)(i);return r.NextResponse.json({success:!0,data:t})}catch(i){return console.error("[api/shipping/[id]/items] Hata:",i),r.NextResponse.json({success:!1,error:"İrsaliye detayları alınamadı"},{status:500})}}let c=new a.AppRouteRouteModule({definition:{kind:n.x.APP_ROUTE,page:"/api/shipping/[id]/items/route",pathname:"/api/shipping/[id]/items",filename:"route",bundlePath:"app/api/shipping/[id]/items/route"},resolvedPagePath:"C:\\Users\\caner.karadag\\Cursor_Projeler\\Tedarikci_Irsaliye\\app\\app\\api\\shipping\\[id]\\items\\route.ts",nextConfigOutput:"",userland:s}),{requestAsyncStorage:d,staticGenerationAsyncStorage:E,serverHooks:_}=c,l="/api/shipping/[id]/items/route";function R(){return(0,p.patchFetch)({serverHooks:_,staticGenerationAsyncStorage:E})}},8555:(i,e,t)=>{t.d(e,{Kv:()=>l,Vs:()=>_,Z$:()=>E,b_:()=>o,cu:()=>p,dr:()=>m,ny:()=>c,r7:()=>R,rH:()=>n,sA:()=>d,v$:()=>u,yV:()=>r});var s=t(9665),a=t(3377);async function n(i){if(null!=i&&""!==i){let e="string"==typeof i?parseInt(i):i;if(!isNaN(e))return(await (0,s.i6)`SELECT * FROM suppliers WHERE company_id = ${e} ORDER BY supplier_name`).rows}return(await (0,s.i6)`SELECT * FROM suppliers ORDER BY supplier_name`).rows}async function p(i){return(await (0,s.i6)`SELECT * FROM suppliers WHERE id = ${i}`).rows[0]||null}async function r(i={}){let{shippingNumber:e,status:t,supplierCode:n,companyId:p,page:r=1,limit:u=10}=i,o=[],c=[],d=1;if(e&&(o.push(`sd.shipping_number LIKE $${d}`),c.push(`%${e}%`),d++),t&&"all"!==t){let i=(0,a.iX)(t);o.push(`sd.status = $${d}`),c.push(i),d++}n&&(o.push(`s.supplier_code = $${d}`),c.push(n),d++),p&&(o.push(`s.company_id = $${d}`),c.push(p),d++);let E=o.length>0?`WHERE ${o.join(" AND ")}`:"",_=`
    SELECT COUNT(DISTINCT sd.id) as count
    FROM shipping_documents sd
    JOIN suppliers s ON s.id = sd.supplier_id
    LEFT JOIN companies c ON c.id = s.company_id
    ${E}
  `,l=await s.i6.query(_,c),R=parseInt(l.rows[0]?.count||"0"),m=`
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
     ${E}
     GROUP BY sd.id, sd.shipping_number, sd.supplier_id, sd.shipping_date, sd.total_amount, sd.item_count, sd.status, sd.notes, sd.created_at, sd.updated_at, s.supplier_name, s.supplier_code, s.id, s.company_id, c.company_name, i.invoice_number
     ORDER BY sd.created_at DESC LIMIT $${d} OFFSET $${d+1}
  `;return{data:(await s.i6.query(m,[...c,u,(r-1)*u])).rows,total:R}}async function u(i){return(await (0,s.i6)`SELECT * FROM shipping_documents WHERE id = ${i}`).rows[0]||null}async function o(i){return(await (0,s.i6)`SELECT * FROM shipping_items WHERE shipping_id = ${i}`).rows}async function c(i){let{shipping_id:e,status:t,total_amount:n}=i,p=(0,a.iX)(t);"number"==typeof n?await (0,s.i6)`
      UPDATE shipping_documents 
      SET status = ${p}, total_amount = ${n}, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ${e}
    `:await (0,s.i6)`
      UPDATE shipping_documents 
      SET status = ${p}, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ${e}
    `}async function d(i={}){let{search:e,status:t,page:a=1,limit:n=10}=i,p=[],r=[],u=1;e&&(p.push(`(invoice_number LIKE $${u} OR notes LIKE $${u+1})`),r.push(`%${e}%`,`%${e}%`),u+=2),t&&"all"!==t&&(p.push(`status = $${u}`),r.push(t),u++);let o=p.length>0?`WHERE ${p.join(" AND ")}`:"",c=`SELECT COUNT(*) as count FROM invoices ${o}`,d=await s.i6.query(c,r),E=parseInt(d.rows[0]?.count||"0"),_=`
    SELECT * FROM invoices 
    ${o} 
    ORDER BY created_at DESC 
    LIMIT $${u} OFFSET $${u+1}
  `;return{data:(await s.i6.query(_,[...r,n,(a-1)*n])).rows,total:E}}async function E(i){let e=await (0,s.i6)`SELECT COUNT(*) as count FROM invoices WHERE invoice_number LIKE '1-R-7-%'`,t=parseInt(e.rows[0]?.count||"0")+1,n=`1-R-7-${t.toString().padStart(3,"0")}`,p=(await (0,s.i6)`
    INSERT INTO invoices (invoice_number, shipping_id, invoice_type, base_amount, tax_amount, discount_amount, total_amount, created_date, due_date, status)
    VALUES (${n}, ${i.shipping_id}, ${i.invoice_type}, ${i.base_amount}, ${i.tax_amount}, ${i.discount_amount}, ${i.total_amount}, ${i.created_date}, ${i.due_date}, 'created')
    RETURNING *
  `).rows[0],r=(0,a.iX)("invoiced");return await (0,s.i6)`
    UPDATE shipping_documents 
    SET status = ${r}, total_amount = ${i.total_amount}, updated_at = CURRENT_TIMESTAMP 
    WHERE id = ${i.shipping_id}
  `,p}async function _(i){return(await (0,s.i6)`
    INSERT INTO price_calculations (shipping_id, invoice_type, calculated_price, base_amount, tax_amount, discount_amount, calculation_method, calculation_details)
    VALUES (${i.shipping_id}, ${i.invoice_type}, ${i.calculated_price}, ${i.base_amount}, ${i.tax_amount}, ${i.discount_amount}, ${i.calculation_method||null}, ${i.calculation_details||null})
    RETURNING *
  `).rows[0]}async function l(i){return(await (0,s.i6)`
    SELECT * FROM price_calculations 
    WHERE shipping_id = ${i} 
    ORDER BY created_at DESC 
    LIMIT 1
  `).rows[0]||null}async function R(i,e){if(e){let t=(0,a.rv)(e),n=await (0,s.i6)`
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
  `).rows}async function m(i,e,t){let n=(0,a.rv)(e),p=await (0,s.i6)`
    SELECT pi.id, pi.invoice_number, pi.invoice_date, pii.quantity, pii.unit_price
    FROM purchase_invoices pi
    JOIN purchase_invoice_items pii ON pii.invoice_id = pi.id
    WHERE pi.supplier_id = ${i} 
    AND UPPER(REPLACE(REPLACE(pii.product_code, ' ', '-'), '  ', '-')) = ${n}
    ORDER BY pi.invoice_date DESC, pi.id DESC
  `;if(0===p.rows.length){let e=n.split("-")[0];e&&e!==n&&(p=await (0,s.i6)`
        SELECT pi.id, pi.invoice_number, pi.invoice_date, pii.quantity, pii.unit_price
        FROM purchase_invoices pi
        JOIN purchase_invoice_items pii ON pii.invoice_id = pi.id
        WHERE pi.supplier_id = ${i} 
        AND UPPER(REPLACE(REPLACE(pii.product_code, ' ', '-'), '  ', '-')) LIKE ${e+"-%"}
        ORDER BY pi.invoice_date DESC, pi.id DESC
      `)}let r=p.rows,u=[],o=t;for(let i of r){if(o<=0)break;let e=Math.min(o,parseInt(i.quantity));e>0&&(u.push({invoiceId:i.id,invoiceNumber:i.invoice_number,invoiceDate:i.invoice_date,quantity:e,unitPrice:parseFloat(i.unit_price),total:e*parseFloat(i.unit_price)}),o-=e)}return u}},3377:(i,e,t)=>{function s(i){return i?i.trim().replace(/\s+/g,"-").toUpperCase():""}function a(i){switch(i){case"calculated":return"approved";case"invoiced":return"rejected";default:return"pending"}}t.d(e,{iX:()=>a,rv:()=>s})}};var e=require("../../../../../webpack-runtime.js");e.C(i);var t=i=>e(e.s=i),s=e.X(0,[276,64],()=>t(4736));module.exports=s})();