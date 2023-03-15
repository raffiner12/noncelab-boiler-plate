const express = require('express') // express 모듈을 가져옴
const app = express()
const port = 5000
const bodyParser = require('body-parser');
const { User } = require("./models/User");

  
// bodyParser 옵션을 좀 준다.
// application/x-ww-form-urlencoded <- 이렇게 된 데이터를 분석해서 가져올 수 있게 해준다.
app.use(bodyParser.urlencoded({extended: true}));

// application/json 타입으로 된 것을 분석해서 가져올 수 있게 해준다.
app.use(bodyParser.json());

const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://noncelabLena:1234*@cluster0.ry13cak.mongodb.net/?retryWrites=true&w=majority ',{
    useNewUrlParser: true, useUnifiedTopology:true // 에러 안뜨게 써주는 것. 몽구스 6버전 이상은 usenewparser,topology, createindex, findandmodify 삭제
}).then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err))


// get 메소드 
app.get('/', (req, res) => { res.send('Hello World!~~ 안녕하세요')})

// 회원가입을 위한 Register Route 만들기 
// post 메소드 이용
//    ('라우트 end포인트', (콜백 함수))
app.post('/register', async (req, res) => {
  
  // 회원 가입할 때 필요한 정보들을 client에서 가져오면
  // 그것들을 데이터 베이스에 넣어준다. -> 모델 폴더의 User.js 가져와야함.
  // User를 가져와 이걸로 인스턴스 만듦
  // bodyParser의 정보들을 데이터 베이스에 넣기 위해서는 (req.body) 해줌.
  // req.body 안에는 json 형식으로 들어있는데, 들어있을 수 있게 해주는 것은 bodyParser가 있어서임.
  // bodyParser를 이용해서 req.body로 client에서 보내는 정보를 받아준다. 
  const user = new User(req.body)

  // 몽구스6부터 콜백 허용 안됨.
      // user를 이용해서 몽고DB에서 오는 메소드 .save를 해줌.
      // user.save((err, userInfo) => {
        // 저장할 때 에러가 있다면 ('성공하지 못했다'고 에러 메세지와 함께 )json형식으로 전달
      //   if(err) return res.json({ success: false, err})
      //   //성공했다면(200) json 형식으로 정보를 전달
      //   return res.status(200).json({
      //     success: true
      //   })
      // })
  const result = await user.save().then(()=> {
    res.status(200).json({
      success: true
    })
  }).catch((err) => {
    res.json({ success: false, err})
  })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
})  