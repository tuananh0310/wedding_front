// RSVP form module
const RSVP = {
  submit: function(vueInstance, config, utils) {
    if (!vueInstance.rsvpName) {
      utils.showToast(vueInstance, 'Vui lòng nhập tên của bạn.', 'error');
      return;
    }
    
    const rsvpData = {
      name: vueInstance.rsvpName,
      will_attend: vueInstance.rsvpAttending === 'yes',
      message: vueInstance.rsvpMessage || ''
    };
    
    const apiUrl = config.api.baseUrl + config.api.endpoints.rsvp;
    
    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(rsvpData)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(_data => {
      utils.showToast(vueInstance, 
        'Cảm ơn bạn đã gửi lời nhắn! Bọn mình rất háo hức được chia sẻ ngày này cùng bạn.', 
        'success');
      vueInstance.rsvpName = '';
      vueInstance.rsvpAttending = 'yes';
      vueInstance.rsvpMessage = '';
      if (window.Messages) {
        window.Messages.fetch(vueInstance, config);
      }
    })
    .catch(error => {
      console.error('Error submitting RSVP:', error);
      let errorMessage = 'Có lỗi xảy ra. Vui lòng thử lại sau.';
      
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        errorMessage = 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối internet và thử lại.';
      } else if (error.message.includes('HTTP error')) {
        errorMessage = 'Server đang gặp sự cố. Vui lòng thử lại sau.';
      }
      
      utils.showToast(vueInstance, errorMessage, 'error');
    });
  },
  
  openMap: function(config) {
    window.open(config.wedding.mapUrl, '_blank');
  }
};
