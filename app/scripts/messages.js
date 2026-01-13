// Wedding messages ticker module
const Messages = {
  fetch: function(vueInstance, config) {
    const apiUrl = config.api.baseUrl + config.api.endpoints.messages;

    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        if (data.success && data.data) {
          const visibleMessages = data.data.filter(item => {
            return item.is_show === true &&
                   item.message &&
                   item.message.trim() !== '';
          });

          const duplicatedMessages = visibleMessages.length > 0
            ? [...visibleMessages, ...visibleMessages, ...visibleMessages]
            : [];

          vueInstance.$set(vueInstance, 'weddingMessages', duplicatedMessages);
          vueInstance.$set(vueInstance, 'messageCount', data.data.length);

          // Force reflow để đảm bảo animation chạy ngay trên mobile
          vueInstance.$nextTick(() => {
            const tickerContents = document.querySelectorAll('.ticker-content');
            tickerContents.forEach(ticker => {
              // Force reflow để trigger animation
              void ticker.offsetWidth;
              // Restart animation nếu cần
              ticker.style.animation = 'none';
              void ticker.offsetWidth;
              ticker.style.animation = '';
            });
          });
        }
      })
      .catch(error => {
        console.error('Error fetching wedding messages:', error);
        // Silently fail - không làm gián đoạn trải nghiệm người dùng
        // Messages sẽ được retry ở lần refresh tiếp theo
      });
  },

  startAutoRefresh: function(vueInstance, config) {
    this.fetch(vueInstance, config);
    vueInstance._messagesInterval = setInterval(() => {
      this.fetch(vueInstance, config);
    }, config.messages.refreshInterval || 30000);
  },

  stopAutoRefresh: function(vueInstance) {
    if (vueInstance._messagesInterval) {
      clearInterval(vueInstance._messagesInterval);
      vueInstance._messagesInterval = null;
    }
  }
};

// Export to window for cross-module access
window.Messages = Messages;
