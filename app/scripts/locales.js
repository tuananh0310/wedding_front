/* global Vue, VueI18n */

let locales = {
  es: {
    start: {
      title: 'Inicio',
      names: 'Tuấn Anh y Thu Phương',
      slogan: 'Historia de un viaje'
    },
    beginning: {
      title: 'Comienzos',
      content: 'Nuestra historia comienza hace {years} años. Nadie pudo imaginar la gran aventura que teníamos por delante.',
    },
    firstMoments: {
      title: 'Primeros momentos',
      content: 'Los últimos kilómetros de nuestro viejo coche nos acercaron a nuestros primeros destinos, conociéndo nuevos lugares y viviendo muchos primeros momentos juntos.',
    },
    madrid: {
      title: 'Madrid',
      content: 'Después de unos años, decidimos irnos a vivir juntos a Madrid. Entonces comenzó nuestra aventura alrededor del mundo.',
    },
    newYork: {
      title: 'Nueva York',
      content: 'Tuvimos que cruzar el charco para hacer nuestra primera parada en la ciudad que nunca duerme: Nueva York.',
    },
    paris: {
      title: 'París',
      content: 'Tras volver a Málaga, pudimos recordar nuestra infancia en París, donde también hubo un ¡SÍ! a la gran pregunta.',
    },
    london: {
      title: 'Londres',
      content: 'Desde que estuvimos viviendo unos meses en Londres, lo consideramos nuestro segundo hogar. ¡No podemos parar de volver una y otra y otra... y otra vez!',
    },
    italy: {
      title: 'Italia',
      content: 'Recorrimos Italia en coche disfrutando de increíbles rincones y deliciosa comida. <br/> ¡Mamma mía!',
    },
    edinburgh: {
      title: 'Edimburgo',
      content: 'Dijimos adiós a uno de nuestros mejores años celebrando el Hogmanay en Edimburgo.',
    },
    japan: {
      title: 'Japón',
      content: 'El futuro nos llevará a conocer nuevas culturas donde cumpliremos nuestros friki-sueños.',
    },
    celebrate: {
      title: '¡Celebrémoslo!',
      content: 'Ahora toca empezar una nueva etapa de nuestra aventura. ¿Quieres acompañarnos?<br><br>¡Te esperamos el 26 de septiembre para celebrarlo!',
    },
  },
  en: {
    start: {
      title: 'Start',
      names: 'Tuấn Anh & Thu Phương',
      slogan: 'Story of a journey'
    },
    beginning: {
      title: 'Beginning',
      content: 'Our story begins {years} years ago. Nobody could imagine the great adventure we had ahead.',
    },
    firstMoments: {
      title: 'First moments',
      content: 'The last kilometers of our old car brought us to our first destination, visiting new places and experiencing many first moments together.',
    },
    madrid: {
      title: 'Madrid',
      content: 'After a few years, we decided to move in together to Madrid. Then began our adventure around the world.',
    },
    newYork: {
      title: 'New York',
      content: 'We had to cross the pond to make our first stop in the city that never sleeps: New York',
    },
    paris: {
      title: 'Paris',
      content: 'After returning to Malaga, we could remember our childhood in Paris, where there was a YES! answering the big question.',
    },
    london: {
      title: 'London',
      content: 'Since we were living in London a few months, we consider it our second home. We can not stop coming back again and again and again ... and again!',
    },
    italy: {
      title: 'Italy',
      content: 'We toured Italy in car enjoying incredible corners and delicious food. <br> Mamma mia!',
    },
    edinburgh: {
      title: 'Edinburgh',
      content: 'We said goodbye to one of our best years celebrating Hogmanay in Edinburgh.',
    },
    japan: {
      title: 'Japan',
      content: 'The future will show us new cultures where we will realize our geek-dreams.',
    },
    celebrate: {
      title: 'Let\'s celebrate it!',
      content: 'Now we are starting a new stage of our adventure. Do you want to join us?<br><br>See you on 26th September to celebrate!',
    },
  },
  vi: {
    start: {
      title: 'Bắt đầu',
      names: 'Tuấn Anh và Thu Phương',
      slogan: 'Câu chuyện của một hành trình'
    },
    beginning: {
      title: 'Khởi đầu',
      content: 'Câu chuyện của chúng tôi bắt đầu từ {years} năm trước. Không ai có thể tưởng tượng được cuộc phiêu lưu tuyệt vời đang chờ đợi phía trước.',
    },
    firstMoments: {
      title: 'Những khoảnh khắc đầu tiên',
      content: 'Những cây số cuối cùng của chiếc xe cũ đã đưa chúng tôi đến những điểm đến đầu tiên, khám phá những nơi mới và trải qua nhiều khoảnh khắc đầu tiên bên nhau.',
    },
    madrid: {
      title: 'Madrid',
      content: 'Sau vài năm, chúng tôi quyết định chuyển đến sống cùng nhau ở Madrid. Từ đó bắt đầu cuộc phiêu lưu vòng quanh thế giới của chúng tôi.',
    },
    newYork: {
      title: 'New York',
      content: 'Chúng tôi phải vượt đại dương để dừng chân đầu tiên tại thành phố không bao giờ ngủ: New York.',
    },
    paris: {
      title: 'Paris',
      content: 'Sau khi trở về Malaga, chúng tôi có thể nhớ lại tuổi thơ ở Paris, nơi cũng có một CÓ! trả lời câu hỏi lớn.',
    },
    london: {
      title: 'London',
      content: 'Kể từ khi sống ở London vài tháng, chúng tôi coi đó là ngôi nhà thứ hai. Chúng tôi không thể ngừng quay lại lần này và lần nữa... và lần nữa!',
    },
    italy: {
      title: 'Ý',
      content: 'Chúng tôi đã du lịch Ý bằng ô tô, tận hưởng những góc phố tuyệt vời và thức ăn ngon. <br> Mamma mia!',
    },
    edinburgh: {
      title: 'Edinburgh',
      content: 'Chúng tôi nói lời tạm biệt với một trong những năm tốt nhất bằng cách ăn mừng Hogmanay ở Edinburgh.',
    },
    japan: {
      title: 'Nhật Bản',
      content: 'Tương lai sẽ đưa chúng tôi đến những nền văn hóa mới nơi chúng tôi sẽ thực hiện những giấc mơ geek của mình.',
    },
    celebrate: {
      title: 'Hãy cùng ăn mừng!',
      content: 'Bây giờ chúng tôi đang bắt đầu một giai đoạn mới trong cuộc phiêu lưu. Bạn có muốn tham gia cùng chúng tôi không?<br><br>Hẹn gặp bạn vào ngày 26 tháng 9 để cùng ăn mừng!',
    },
  }
};

let lang = navigator.languages ? navigator.languages[0] : (navigator.language || navigator.userLanguage);
if (lang) {
  lang = lang.split('-')[0];
}

Vue.use(VueI18n);

const i18n = new VueI18n({
  locale: lang || 'vi',
  fallbackLocale: 'vi',
  messages: locales
});

window.APP_I18N = i18n;
