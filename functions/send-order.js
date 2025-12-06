// functions/sendOrder.js
exports.handler = async (event) => {
  try {
    const order = JSON.parse(event.body);
    const { restaurantId, restaurantName, items } = order;
    
    // ⭐ رقم واحد لجميع المطاعم
    const WHATSAPP_NUMBER = "963957275347";
    
    // لا نحتاج قائمة مطاعم، كل صفحة ترسل اسمها
    const message = createOrderMessage(order);
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    
    // تسجيل الطلب في الكونسول
    console.log('📦 طلب جديد:', {
      المطعم: restaurantName || restaurantId,
      العميل: order.customer.name,
      العنوان: order.customer.address,
      المجموع: order.total + ' ل.س',
      عدد_الوجبات: items.length
    });
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: `✅ تم استلام طلب ${restaurantName}`,
        whatsappUrl: whatsappUrl
      })
    };
    
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        success: false,
        error: error.message
      })
    };
  }
};

// دالة إنشاء الرسالة
function createOrderMessage(order) {
  const { customer, items, total, payment, restaurantName } = order;
  
  let message = `🆕 *طلب جديد*\n`;
  message += `🏪 *المطعم:* ${restaurantName}\n\n`;
  message += `👤 *العميل:* ${customer.name}\n`;
  message += `📞 *الهاتف:* ${customer.phone}\n`;
  message += `📍 *العنوان:* ${customer.address}\n\n`;
  message += `📋 *الطلبات:*\n`;
  
  items.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    message += `${index + 1}. ${item.name}\n`;
    message += `   ${item.quantity} × ${item.price} = ${itemTotal} ل.س\n`;
  });
  
  message += `\n💰 *المجموع:* ${total} ل.س\n`;
  message += `💳 *طريقة الدفع:* ${getPaymentMethod(payment)}\n\n`;
  message += `⏰ *وقت الطلب:* ${new Date().toLocaleTimeString('ar-SA')}\n`;
  message += `📅 *التاريخ:* ${new Date().toLocaleDateString('ar-SA')}\n\n`;
  message += `🚀 تم إرسال الطلب عبر تطبيق Salamia Deliveo`;
  
  return message;
}

function getPaymentMethod(payment) {
  const methods = {
    'cash': '💰 نقداً عند الاستلام',
    'shamcash': '💳 شام كاش',
    'usdt': '🔗 USDT'
  };
  return methods[payment] || payment;
}