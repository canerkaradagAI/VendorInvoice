"use strict";(()=>{var i={};i.id=243,i.ids=[243],i.modules={399:i=>{i.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},517:i=>{i.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},8893:i=>{i.exports=require("buffer")},4770:i=>{i.exports=require("crypto")},7702:i=>{i.exports=require("events")},2048:i=>{i.exports=require("fs")},2615:i=>{i.exports=require("http")},8791:i=>{i.exports=require("https")},8216:i=>{i.exports=require("net")},9801:i=>{i.exports=require("os")},5315:i=>{i.exports=require("path")},6162:i=>{i.exports=require("stream")},2452:i=>{i.exports=require("tls")},7360:i=>{i.exports=require("url")},1568:i=>{i.exports=require("zlib")},4214:(i,e,t)=>{t.r(e),t.d(e,{originalPathname:()=>R,patchFetch:()=>m,requestAsyncStorage:()=>_,routeModule:()=>d,serverHooks:()=>l,staticGenerationAsyncStorage:()=>E});var s={};t.r(s),t.d(s,{GET:()=>p,POST:()=>c});var a=t(9303),n=t(8716),r=t(670),o=t(7070),u=t(8555);async function p(i){try{let{searchParams:e}=new URL(i.url),t=e.get("search"),s=e.get("status"),a=Number.parseInt(e.get("page")||"1"),n=Number.parseInt(e.get("limit")||"10");console.log("[v0] Fatura listesi API \xe7ağrısı:",{search:t,status:s,page:a,limit:n});let{data:r,total:p}=await (0,u.sA)({search:t||void 0,status:s||void 0,page:a,limit:n});return o.NextResponse.json({success:!0,data:r,pagination:{page:a,limit:n,total:p,totalPages:Math.ceil(p/n)}})}catch(i){return console.error("[v0] Fatura listesi API hatası:",i),o.NextResponse.json({success:!1,error:"Fatura listesi alınırken bir hata oluştu"},{status:500})}}async function c(i){try{let{shippingId:e,shippingNumber:t,priceCalculation:s}=await i.json();console.log("[v0] Fatura oluşturma API \xe7ağrısı:",{shippingId:e,shippingNumber:t,priceCalculation:s});let a=await (0,u.Z$)({shipping_id:parseInt(e),invoice_type:s.invoiceType,base_amount:s.breakdown.baseAmount,tax_amount:s.breakdown.taxAmount,discount_amount:s.breakdown.discountAmount,total_amount:s.calculatedPrice,created_date:new Date().toISOString().split("T")[0],due_date:new Date(Date.now()+2592e6).toISOString().split("T")[0]});return o.NextResponse.json({success:!0,data:{invoice:a,message:"Fatura başarıyla oluşturuldu"}})}catch(i){return console.error("[v0] Fatura oluşturma API hatası:",i),o.NextResponse.json({success:!1,error:"Fatura oluşturulurken bir hata oluştu"},{status:500})}}let d=new a.AppRouteRouteModule({definition:{kind:n.x.APP_ROUTE,page:"/api/invoices/route",pathname:"/api/invoices",filename:"route",bundlePath:"app/api/invoices/route"},resolvedPagePath:"C:\\Users\\caner.karadag\\Cursor_Projeler\\Tedarikci_Irsaliye\\app\\app\\api\\invoices\\route.ts",nextConfigOutput:"",userland:s}),{requestAsyncStorage:_,staticGenerationAsyncStorage:E,serverHooks:l}=d,R="/api/invoices/route";function m(){return(0,r.patchFetch)({serverHooks:l,staticGenerationAsyncStorage:E})}},8555:(i,e,t)=>{t.d(e,{Kv:()=>l,Vs:()=>E,Z$:()=>_,b_:()=>p,cu:()=>r,dr:()=>m,ny:()=>c,r7:()=>R,rH:()=>n,sA:()=>d,v$:()=>u,yV:()=>o});var s=t(9665),a=t(3377);async function n(i){if(null!=i&&""!==i){let e="string"==typeof i?parseInt(i):i;if(!isNaN(e))return(await (0,s.i6)`SELECT * FROM suppliers WHERE company_id = ${e} ORDER BY supplier_name`).rows}return(await (0,s.i6)`SELECT * FROM suppliers ORDER BY supplier_name`).rows}async function r(i){return(await (0,s.i6)`SELECT * FROM suppliers WHERE id = ${i}`).rows[0]||null}async function o(i={}){let{shippingNumber:e,status:t,supplierCode:n,companyId:r,page:o=1,limit:u=10}=i,p=[],c=[],d=1;if(e&&(p.push(`sd.shipping_number LIKE $${d}`),c.push(`%${e}%`),d++),t&&"all"!==t){let i=(0,a.iX)(t);p.push(`sd.status = $${d}`),c.push(i),d++}n&&(p.push(`s.supplier_code = $${d}`),c.push(n),d++),r&&(p.push(`s.company_id = $${d}`),c.push(r),d++);let _=p.length>0?`WHERE ${p.join(" AND ")}`:"",E=`
    SELECT COUNT(DISTINCT sd.id) as count
    FROM shipping_documents sd
    JOIN suppliers s ON s.id = sd.supplier_id
    LEFT JOIN companies c ON c.id = s.company_id
    ${_}
  `,l=await s.i6.query(E,c),R=parseInt(l.rows[0]?.count||"0"),m=`
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
  `;return{data:(await s.i6.query(m,[...c,u,(o-1)*u])).rows,total:R}}async function u(i){return(await (0,s.i6)`SELECT * FROM shipping_documents WHERE id = ${i}`).rows[0]||null}async function p(i){return(await (0,s.i6)`SELECT * FROM shipping_items WHERE shipping_id = ${i}`).rows}async function c(i){let{shipping_id:e,status:t,total_amount:n}=i,r=(0,a.iX)(t);"number"==typeof n?await (0,s.i6)`
      UPDATE shipping_documents 
      SET status = ${r}, total_amount = ${n}, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ${e}
    `:await (0,s.i6)`
      UPDATE shipping_documents 
      SET status = ${r}, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ${e}
    `}async function d(i={}){let{search:e,status:t,page:a=1,limit:n=10}=i,r=[],o=[],u=1;e&&(r.push(`(invoice_number LIKE $${u} OR notes LIKE $${u+1})`),o.push(`%${e}%`,`%${e}%`),u+=2),t&&"all"!==t&&(r.push(`status = $${u}`),o.push(t),u++);let p=r.length>0?`WHERE ${r.join(" AND ")}`:"",c=`SELECT COUNT(*) as count FROM invoices ${p}`,d=await s.i6.query(c,o),_=parseInt(d.rows[0]?.count||"0"),E=`
    SELECT * FROM invoices 
    ${p} 
    ORDER BY created_at DESC 
    LIMIT $${u} OFFSET $${u+1}
  `;return{data:(await s.i6.query(E,[...o,n,(a-1)*n])).rows,total:_}}async function _(i){let e=await (0,s.i6)`SELECT COUNT(*) as count FROM invoices WHERE invoice_number LIKE '1-R-7-%'`,t=parseInt(e.rows[0]?.count||"0")+1,n=`1-R-7-${t.toString().padStart(3,"0")}`,r=(await (0,s.i6)`
    INSERT INTO invoices (invoice_number, shipping_id, invoice_type, base_amount, tax_amount, discount_amount, total_amount, created_date, due_date, status)
    VALUES (${n}, ${i.shipping_id}, ${i.invoice_type}, ${i.base_amount}, ${i.tax_amount}, ${i.discount_amount}, ${i.total_amount}, ${i.created_date}, ${i.due_date}, 'created')
    RETURNING *
  `).rows[0],o=(0,a.iX)("invoiced");return await (0,s.i6)`
    UPDATE shipping_documents 
    SET status = ${o}, total_amount = ${i.total_amount}, updated_at = CURRENT_TIMESTAMP 
    WHERE id = ${i.shipping_id}
  `,r}async function E(i){return(await (0,s.i6)`
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
  `).rows}async function m(i,e,t){let n=(0,a.rv)(e),r=await (0,s.i6)`
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
      `)}let o=r.rows,u=[],p=t;for(let i of o){if(p<=0)break;let e=Math.min(p,parseInt(i.quantity));e>0&&(u.push({invoiceId:i.id,invoiceNumber:i.invoice_number,invoiceDate:i.invoice_date,quantity:e,unitPrice:parseFloat(i.unit_price),total:e*parseFloat(i.unit_price)}),p-=e)}return u}},3377:(i,e,t)=>{function s(i){return i?i.trim().replace(/\s+/g,"-").toUpperCase():""}function a(i){switch(i){case"calculated":return"approved";case"invoiced":return"rejected";default:return"pending"}}t.d(e,{iX:()=>a,rv:()=>s})}};var e=require("../../../webpack-runtime.js");e.C(i);var t=i=>e(e.s=i),s=e.X(0,[276,64],()=>t(4214));module.exports=s})();