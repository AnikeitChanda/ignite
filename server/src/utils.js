const SQL = require('sequelize');
const http = require('http');

function populateDB(events) {
  //known keys with activities
  const keys = [3943506, 4704256, 5808228, 6081071, 5881028, 3136036, 4981819, 2095681, 1382389, 1408058, 8125168, 5665663, 9318514, 1516976, 7114122, 5092652, 2581372, 7526324, 3136729, 3192099, 1668223, 1668223, 1505028, 4290333, 9212950, 5262759, 4614092, 6197243, 6613330, 7265395, 5940465, 1638604, 7806284, 1093640, 5590133, 5947957, 2211716, 2237769, 6925988, 1017771, 1488053, 1432113, 6509779, 3920096, 8979931, 6553978, 1947449, 8631548, 2055368, 9364041, 1162360, 8364626, 1934228, 9026787, 6596257, 3141417, 4124860, 8557562, 4565537, 1718657, 8503795, 2352669, 4894697, 3456114, 4101229, 2896176, 6301585, 8321894, 6808057, 7023703, 8731971,8926492, 2790297, 1645485, 4809815, 4379552, 6778219, 7091374, 4387026, 6693574, 8344539, 4558850, 8253550, 5585829, 9072906, 4877086, 1288934, 2085321, 8832605, 6613428, 3818400, 8779876, 6482790, 2735499, 5881647, 9924423, 9366464, 8081693, 5554727, 9414706, 8724324, 8092359, 5554174, 6813070, 8442249, 4179309, 8750692, 9999999, 1000000, 8394738, 4522866, 3352474, 4708863, 1878070, 1592381, 6204657, 9266212, 3950821, 6852505, 9216391, 5675880, 1799120, 2715253, 2167064, 8683473, 2742452, 6826029, 8264223, 4448913, 8570429, 3469378, 8238918, 3561421, 4296813, 3149232, 3141592, 4688012, 5490351, 3305912, 19413];
  var successes = true;

  for (var i = 0; i < keys.length; i++){
    http.get('http://www.boredapi.com/api/activity?key='+keys[i], (resp) => {
      let data = '';

      resp.on('data', (chunk) => {
        data += chunk;
      });

      resp.on('end', async () => {
        var event = JSON.parse(data);
        if(event.error == null){
          const success = await events.create({
            activity: event.activity,
            accessibility: event.accessibility,
            type: event.type,
            participants: event.participants,
            price: event.price
          });
          successes = success && successes;
        }
        events.sync({ alter : true});
      });
    
    }).on("error", (err) => {
      console.log("Error: " + err.message);
    });
  }

  return successes;
}

module.exports.allEvents = () => {
  //remember to change for commit
  const db = new SQL('db', 'user', 'pw', {
    dialect: 'mysql',
    host: '35.238.128.54',
    port: 3306,
    logging: false
  });

  const events = db.define('event', {
    id: {
      type: SQL.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    activity: SQL.STRING,
    accessibility: SQL.FLOAT,
    type: SQL.STRING,
    participants: SQL.INTEGER,
    price: SQL.INTEGER
  });

  populateDB(events);

  return events;
}
