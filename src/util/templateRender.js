import moment from 'moment'
import * as accounting from 'accounting-js'

const getProductTplByTable = fullTpl => {
  const match = fullTpl.match(/<table.*data-product-table(.|\n)*<\/table>/)[0]
  const firstIndex = match.indexOf('</table>')
  const result = match.substr(0, firstIndex + 8)
  return result
}

const formatMoney = amount => `US${accounting.formatMoney(amount, 'US$')}`

// const numberWithCommas = x => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")

function getRandomNumberBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

const getProductTplByRow = fullTpl => {
  const match = fullTpl.match(/<tr.*data-product-table(.|\n)*<\/tr>/)[0]
  const firstIndex = match.indexOf('</tr>')
  const result = match.substr(0, firstIndex + 5)
  return result
}

const getSkuById = (data, skuId) => data.skus.filter(sku => sku.id === skuId)[0]
const getSpuById = (data, spuId) => data.spus.filter(spu => spu.id === spuId)[0]
const skuSpecification = (data, product) => {
  const sku = getSkuById(data, product.sku_id)
  const spu = getSpuById(data, product.spu_id)
  const printable_attr_ids = spu.printable_attr_ids.split(',').map(id => Number(id))
  const needToPrintAttrs = [...spu.basic_attr, ...sku.sale_attr_list].filter(attr => printable_attr_ids.includes(attr.attr_id),)
  console.log('ned to pring', needToPrintAttrs)
  let spe = ''
  for (let i = 0; i < needToPrintAttrs.length; i++) {
    const currentItem = needToPrintAttrs[i]
    spe = `${spe}${currentItem.attr_name}: ${currentItem.attr_value}`
    if (i + 1 !== needToPrintAttrs.length) {
      spe = `${spe}<br>`
    }
  }
  console.log('spec', spe)
  return spe
}

const getPackingDetail = sku => {
  const { quantity_per_carton, net_weight_per_carton, gross_weight_per_carton, carton_measurement, carton_size } = sku
  return `Quantity per carton: ${quantity_per_carton} pcs<br>
          Net weight per carton: ${net_weight_per_carton} kg<br>
          Gross weight per carton: ${gross_weight_per_carton} kg<br>
          Carton measurement: ${carton_measurement} m³<br>
          Carton size: ${carton_size} cm`
}

export const tpl1 = (data, tpl) => {
  console.log(data)
  const productTpl = getProductTplByTable(tpl)
  const { client_info, current_user } = data
  // render product
  const productList = data.products
    .map(product => {
      const skuData = getSkuById(data, product.sku_id)
      const spuData = getSpuById(data, product.spu_id)
      let oneProduct = productTpl
      oneProduct = oneProduct.replaceAll('{products.spu_title}', skuData.sku_title)
      oneProduct = oneProduct.replaceAll('{products.spu_no}', skuData.sku_name)
      oneProduct = oneProduct.replaceAll('{size}', skuData.size)
      oneProduct = oneProduct.replaceAll('{weight}', skuData.weight)
      oneProduct = oneProduct.replaceAll('{specification}', skuSpecification(data, product))
      oneProduct = oneProduct.replaceAll('{certificates}', spuData.certificates)
      oneProduct = oneProduct.replaceAll('{special request}', product.special_request)
      oneProduct = oneProduct.replaceAll('{packing detail}', getPackingDetail(skuData))

      // price range
      for (let i = 0; i < 3; i++) {
        const currentPrice = skuData.price_list[i]
        const countStr = `${currentPrice.start_count} pcs ~ ${currentPrice.end_count} pcs`
        const priceStr = formatMoney(Number(currentPrice.price))
        oneProduct = oneProduct.replaceAll(`{range ${i + 1}}`, countStr)
        oneProduct = oneProduct.replaceAll(`{range ${i + 1} price}`, priceStr)
      }

      oneProduct = oneProduct.replaceAll(
        '{products.img}',
        `<img style="display: block; margin-left: auto; margin-right: auto;" src="${
          spuData.img_url
        }" alt="" width="206" height="206" />`,
      )

      return oneProduct
    })
    .join('')

  const contactMethod = JSON.parse(client_info.contact_methods)
  const findClientContactMethodbyKey = key => contactMethod.filter(item => item.method === key)[0].detail

  let fullTpl = tpl.replace(productTpl, productList)
  fullTpl = fullTpl.replace('{客户名称}', client_info.company_name || 'NOT FOUND')
  fullTpl = fullTpl.replace('{地址}', client_info.address || 'NOT FOUND')
  fullTpl = fullTpl.replace('{姓名}', client_info.client_name)
  fullTpl = fullTpl.replace('{邮箱}', findClientContactMethodbyKey('邮箱'))
  fullTpl = fullTpl.replaceAll('{手机}', findClientContactMethodbyKey('电话'))
  fullTpl = fullTpl.replace('{delivery address}', data.delivery_address || 'same as left')
  fullTpl = fullTpl.replace('{Customer ID}', client_info.code)
  fullTpl = fullTpl.replace('{Date}', moment().format('MMMM Do, YYYY'))

  fullTpl = fullTpl.replace('{创建人}', current_user.username)
  fullTpl = fullTpl.replace('{sales email}', current_user.email || 'stanley@gmial.com')

  return fullTpl
}

export const tpl2 = (data, tpl) => {
  const { client_info, current_user, products } = data
  const productTpl = getProductTplByRow(tpl)
  const productTotalCount = {
    weight: 0,
    quantity: 0,
    total: 0,
    packing: 0,
  }
  const productList = products
    .map(product => {
      let oneProduct = productTpl
      const skuForCurrentProduct = getSkuById(data, product.sku_id)
      oneProduct = oneProduct.replace('{产品标题}', skuForCurrentProduct.sku_title)
      oneProduct = oneProduct.replace('{weight}', skuForCurrentProduct.weight)
      oneProduct = oneProduct.replace('{quantity}', product.quantity)
      oneProduct = oneProduct.replace('{unit-value}', formatMoney(product.price))
      oneProduct = oneProduct.replace('{total}', formatMoney(Number(product.quantity) * Number(product.price)))
      productTotalCount.weight += Number(skuForCurrentProduct.weight)
      productTotalCount.quantity += Number(product.quantity)
      productTotalCount.total += Number(product.quantity) * Number(product.price)

      productTotalCount.packing += Math.ceil(
        Number(product.quantity) / Number(skuForCurrentProduct.quantity_per_carton),
      )

      return oneProduct
    })
    .join('')

  let fullTpl = tpl.replace(productTpl, productList)
  fullTpl = fullTpl.replace('{total-weight}', productTotalCount.weight)
  fullTpl = fullTpl.replace('{total-quantity}', productTotalCount.quantity)
  fullTpl = fullTpl.replace('{total-total}', formatMoney(productTotalCount.total))

  fullTpl = fullTpl.replace('{fright-cost}', formatMoney(data.shipping_cost) || '/')
  fullTpl = fullTpl.replace('{insurance-cost}', formatMoney(data.insurance_cost) || '/')
  fullTpl = fullTpl.replace('{addtional-cost}', formatMoney(data.additional_cost) || '/')
  fullTpl = fullTpl.replace(
    '{total-cost}',
    formatMoney(
      productTotalCount.total
        + (Number(data.shipping_cost) || 0)
        + (Number(data.insurance_cost) || 0)
        + (Number(data.additional_cost) || 0),
    ),
  )

  fullTpl = fullTpl.replace('{total-no-packing}', productTotalCount.packing)

  fullTpl = fullTpl.replace('{Date-export}', moment().format('MMMM Do, YYYY'))
  fullTpl = fullTpl.replace('{terms}', data.terms_of_sale.split(',').join('/'))
  fullTpl = fullTpl.replace('{Date}', moment().format('MMMM Do, YYYY'))
  fullTpl = fullTpl.replace('{Customer ID}', client_info.code)
  const month = new Date().getMonth() + 1 < 10 ? `0${String(new Date().getMonth() + 1)}` : String(new Date().getMonth() + 1)
  const randomNum = `${getRandomNumberBetween(0, 9)}${getRandomNumberBetween(0, 9)}`
  const invoiceId = `${client_info.code}${current_user.nickname.toUpperCase().substr(0, 2) || 'st'}${month}${randomNum}`

  fullTpl = fullTpl.replace('{客户名称}', client_info.client_name)
  fullTpl = fullTpl.replace('{地址}', client_info.address || '/')

  const contactMethod = JSON.parse(client_info.contact_methods)
  const findClientContactMethodbyKey = key => contactMethod.filter(item => item.method === key)[0].detail

  fullTpl = fullTpl.replace('{邮箱}', findClientContactMethodbyKey('邮箱'))

  fullTpl = fullTpl.replace('{Invoice ID}', invoiceId)
  return fullTpl
}

export const tpl3 = (data, tpl) => {
  const { client_info, current_user, products } = data
  const productTpl = getProductTplByRow(tpl)
  const productTotalCount = {
    total: 0,
  }
  const productList = products
    .map(product => {
      let oneProduct = productTpl
      const skuForCurrentProduct = getSkuById(data, product.sku_id)
      const spuForCurrentProduct = getSpuById(data, product.spu_id)
      oneProduct = oneProduct.replace('{sku-no}', skuForCurrentProduct.sku_name)
      oneProduct = oneProduct.replace(
        '{products.img}',
        `<img style="display: block; margin-left: auto; margin-right: auto;" src="${
          spuForCurrentProduct.img_url
        }" alt="" width="80" height="80" />`,
      )
      oneProduct = oneProduct.replace('{sku-des}', skuForCurrentProduct.sku_desc || 'no sku descrption')
      oneProduct = oneProduct.replace('{quantity}', product.quantity)
      oneProduct = oneProduct.replace('{unit-price}', formatMoney(product.price))
      oneProduct = oneProduct.replace('{t-price}', formatMoney(Number(product.quantity) * Number(product.price)))

      productTotalCount.total += Number(product.quantity) * Number(product.price)
      return oneProduct
    })
    .join('')

  let fullTpl = tpl.replace(productTpl, productList)
  fullTpl = fullTpl.replace('{s-price}', formatMoney(productTotalCount.total))
  fullTpl = fullTpl.replace('{sh-price}', formatMoney(data.shipping_cost) || '/')
  fullTpl = fullTpl.replace('{to-fee}', formatMoney(data.transaction_fee) || '/')
  fullTpl = fullTpl.replace(
    '{ttt}',
    formatMoney(productTotalCount.total + (Number(data.shipping_cost) || 0) + (Number(data.transaction_fee) || 0)),
  )

  fullTpl = fullTpl.replace('{Date}', moment().format('MMMM Do, YYYY'))
  fullTpl = fullTpl.replace('{Customer ID}', client_info.code)
  const month = new Date().getMonth() + 1 < 10 ? `0${String(new Date().getMonth() + 1)}` : String(new Date().getMonth() + 1)
  const randomNum = `${getRandomNumberBetween(0, 9)}${getRandomNumberBetween(0, 9)}`
  const invoiceId = `${client_info.code}${current_user.nickname.toUpperCase().substr(0, 2) || 'st'}${month}${randomNum}`
  fullTpl = fullTpl.replace('{Invoice ID}', invoiceId)

  fullTpl = fullTpl.replace('{客户名称}', client_info.client_name)
  fullTpl = fullTpl.replace('{姓名}', client_info.client_name)
  fullTpl = fullTpl.replace('{地址}', client_info.address || '/')

  const contactMethod = JSON.parse(client_info.contact_methods)
  const findClientContactMethodbyKey = key => contactMethod.filter(item => item.method === key)[0].detail
  fullTpl = fullTpl.replace('{邮箱}', findClientContactMethodbyKey('邮箱'))
  fullTpl = fullTpl.replaceAll('{手机}', findClientContactMethodbyKey('电话'))

  fullTpl = fullTpl.replace('{创建人}', current_user.username)
  fullTpl = fullTpl.replace('{sales-email}', current_user.email || 'stanley@gmial.com')
  fullTpl = fullTpl.replace('{delivery address}', data.delivery_address || 'same as left')

  return fullTpl
}

export const tpl4 = (data, tpl) => {
  const { client_info, current_user, products } = data
  const productTpl = getProductTplByRow(tpl)
  const productTotalCount = {
    total: 0,
    quantity: 0,
    netWeight: 0,
    grossWeight: 0,
    ctnMeasure: 0,
    ctns: 0,
  }
  const productList = products
    .map(product => {
      let oneProduct = productTpl
      const skuForCurrentProduct = getSkuById(data, product.sku_id)
      oneProduct = oneProduct.replace('{sku-no}', skuForCurrentProduct.sku_name)
      oneProduct = oneProduct.replace('{sku-name}', skuForCurrentProduct.sku_title)
      oneProduct = oneProduct.replace('{qpc}', skuForCurrentProduct.quantity_per_carton)
      oneProduct = oneProduct.replace('{quantity}', product.quantity)
      oneProduct = oneProduct.replace('{net-wieght}', skuForCurrentProduct.net_weight_per_carton)
      oneProduct = oneProduct.replace('{gross-weight}', skuForCurrentProduct.gross_weight_per_carton)

      const totalCtns = Math.ceil(Number(product.quantity) / Number(skuForCurrentProduct.quantity_per_carton))
      oneProduct = oneProduct.replace('{ctns}', String(totalCtns))
      productTotalCount.ctns += totalCtns
      const totalNetWeight = totalCtns * Number(skuForCurrentProduct.net_weight_per_carton)
      const totalGrossWeight = totalCtns * Number(skuForCurrentProduct.gross_weight_per_carton)
      const totalCtnMam = totalCtns * Number(skuForCurrentProduct.carton_measurement)
      oneProduct = oneProduct.replace('{ctn-ms}', String(totalCtnMam))
      productTotalCount.netWeight += totalNetWeight
      productTotalCount.grossWeight += totalGrossWeight
      productTotalCount.ctnMeasure += totalCtnMam
      productTotalCount.quantity += Number(product.quantity)

      return oneProduct
    })
    .join('')

  let fullTpl = tpl.replace(productTpl, productList)
  fullTpl = fullTpl.replace('{total-ctns}', productTotalCount.ctns)
  fullTpl = fullTpl.replace('{tt-qty}', productTotalCount.quantity)
  fullTpl = fullTpl.replace('{tt-nw}', productTotalCount.netWeight)
  fullTpl = fullTpl.replace('{tt-gw}', productTotalCount.grossWeight)
  fullTpl = fullTpl.replace('{tt-cm}', productTotalCount.ctnMeasure)

  fullTpl = fullTpl.replaceAll('{Date}', moment().format('MMMM Do, YYYY'))
  const month = new Date().getMonth() + 1 < 10 ? `0${String(new Date().getMonth() + 1)}` : String(new Date().getMonth() + 1)
  const randomNum = `${getRandomNumberBetween(0, 9)}${getRandomNumberBetween(0, 9)}`
  const invoiceId = `${client_info.code}${current_user.nickname.toUpperCase().substr(0, 2) || 'st'}${month}${randomNum}`
  fullTpl = fullTpl.replace('{Invoice ID}', invoiceId)

  fullTpl = fullTpl.replace('{客户名称}', client_info.client_name)
  fullTpl = fullTpl.replace('{地址}', client_info.address || '/')

  const contactMethod = JSON.parse(client_info.contact_methods)
  const findClientContactMethodbyKey = key => contactMethod.filter(item => item.method === key)[0].detail
  fullTpl = fullTpl.replace('{邮箱}', findClientContactMethodbyKey('邮箱'))
  fullTpl = fullTpl.replace('{terms}', data.terms_of_sale.split(',').join('/'))

  return fullTpl
}
