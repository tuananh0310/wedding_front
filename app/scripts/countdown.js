// Countdown timer module
const Countdown = {
  update: function(vueInstance) {
    if (!vueInstance.weddingDate) {
      return;
    }

    const now = new Date();
    let diff = vueInstance.weddingDate.getTime() - now.getTime();
    if (diff < 0) {
      diff = 0;
    }

    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / (60 * 60 * 24));
    const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60));
    const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
    const seconds = totalSeconds % 60;

    vueInstance.countdown = {
      totalMs: diff,
      days: days,
      hours: hours,
      minutes: minutes,
      seconds: seconds
    };
  },

  start: function(vueInstance) {
    this.update(vueInstance);
    vueInstance._countdownInterval = setInterval(() => {
      this.update(vueInstance);
    }, 1000);
  },

  stop: function(vueInstance) {
    if (vueInstance._countdownInterval) {
      clearInterval(vueInstance._countdownInterval);
      vueInstance._countdownInterval = null;
    }
  }
};
