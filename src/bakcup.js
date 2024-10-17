import { log } from "console";
import express from "express";
import mysql from "mysql";
import path from "path";
/* DONGHYUN*/

import dbconfig from '../config/dbconfig.js';
const db = mysql.createConnection( dbconfig );
/*let dbData = null;
async function fetchDataFromDatabase() {
            try {
                const [data1, data2] = await Promise.all([
                    new Promise((resolve, reject) => {
                        connection.query('select * from movies where 1', (error, results) => {
                            if (error) reject(error);
                            resolve(results);
                        });
                    }),
                    new Promise((resolve, reject) => {
                        connection.query('select B.movie_id, B.duration, B.title,  A.start_time, B.img_path from showtimes A join movies B on A.movie_id = B.movie_id', (error, results) => {
                            if (error) reject(error);
                            resolve(results);
                        });
                    })
                ]);
        
                // 결과를 객체로 묶기
                const result = {
                    movie_selection_data: data1,
                    movie_time_selection_data: data2,
                };
                return result;
        
            } catch (error) {
                console.error('Error fetching data:', error);
            }
}

fetchDataFromDatabase().then(result => {
    dbData = result; // 데이터 출력
    console.log(dbData);
});*/

/* END DONGHYUN */
const app = express();

app.use(express.static("public"));

app.set("view engine", "ejs");
app.set("views", "view");

app.listen(45120, () => {
    console.log("http://kkms4001.iptime.org:45120    45120 Port is ready");
});


/*******************************************************************/
//DONGHYUN DB ROUTING

app.use(express.json());

app.use(express.urlencoded({ extended: true }));


db.connect((err) => {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }
    console.log('Connected to database.');
});

app.post("/movie_selection1", (req, res) => {
    db.query('SELECT * FROM movies WHERE 1', (err, dbData) => {
        if (err) {
            console.error(err); // 쿼리 오류 처리
            res.status(500).send('Database query error');
        } else {
            res.json(dbData); // 정상적으로 dbData를 클라이언트에 반환
        }
    });
});

app.post("/movie_selection2", (req, res) => {
    const sql = 'SELECT B.movie_id, B.duration, B.title, A.start_time, B.img_path FROM showtimes A JOIN movies B ON A.movie_id = B.movie_id'
    db.query(sql, (err, dbData) => {
        if (err) {
            console.error(err); // 쿼리 오류 처리
            res.status(500).send('Database query error');
        } else {

            res.json(dbData); // 정상적으로 dbData를 클라이언트에 반환
        }
    });
});

app.post("/checkUser", (req, res) => {
    console.log(req.body.checkInformation)
    const checkInformation = req.body.checkInformation;
    const sql = `select M.movie_id, M.duration, M.title, R.showtime, (R.adult_count + R.youth_count + special_count) ticket_count, R.seat_names, M.img_path 
    from reservations R join movies M on R.movie_id = M.movie_id where reservation_num = "${checkInformation}";`
    // const sql = `select * from reservations where reservation_num = "${checkInformation}"`;
    console.log(sql);
    db.query(sql, (err, dbData) => {
        if (err) {
            console.error(err); // 쿼리 오류 처리
            res.status(500).send('Database query error');
        } else {
            if (dbData && dbData.length > 0) { // 데이터가 있으면
                res.json(dbData);
                console.log( "checkUser : " + dbData )
		console.log(dbData);
                console.log("예약된 정보가 있다.");
                // res.redirect(`/ticket_info?reservation_num=${checkInformation}`)
            } else { // 데이터가 없으면
                console.log("예약된 정보가 없다.");
                res.json("no reservation"); // 데이터가 없을 때 리다이렉트할 페이지
            }
        }
    });
});

/*app.post("/checkUser",(req,res)=>{
	console.log(req.body.checkInformation)
    const checkInformation = req.body.checkInformation;
    const sql = `select * from reservations where reservation_num = "${checkInformation}"`;
    
    db.query(sql, (err, dbData) => {
        if (err) {
            console.error(err); // 쿼리 오류 처리
            res.status(500).send('Database query error');
        } else {
            if (dbData && dbData.length > 0) { // 데이터가 있으면
                console.log("Dbdata: ", dbData);
                console.log("데이터 있다.");
                // req.body.checkInformation
		console.log( `/ticket_info?num=${checkInformation}` )
		res.json("데이터있다");
                //res.redirect(`/ticket_info?num=${checkInformation}`)
            } else { // 데이터가 없으면
                console.log("Dbdata: ", dbData);
                console.log("데이터 없다.");
                res.json(undefined); // 데이터가 없을 때 리다이렉트할 페이지
            }
        }
    });
});*/


app.post("/select_movie_time", (req, res) => {
    console.log("post접속 : " + req.body.title); // 타이틀 확인
    const title = req.body.title;
    const sql = `
            select B.movie_id, B.duration, B.title,  A.start_time, B.img_path, C.theater_name,
            C.total_seats,
            (select count(*) from seats D where reservation_status = 0 and A.start_time = D.start_time and B.movie_id = D.movie_id) as reservable_seats
            from showtimes A
            join movies B
            on A.movie_id = B.movie_id
            join theaters C
            on C.theater_id = A.theater_id
            where B.title = "${title}"
	    order by start_time;`

    db.query(sql, (err, dbData) => {
        if (err) {
            console.error(err); // 쿼리 오류 처리
            res.status(500).send('Database query error');
        } else {
            res.json(dbData); // 정상적으로 dbData를 클라이언트에 반환
        }
    });
});

app.post("/select_seat",(req,res)=>{
    console.log(req.body);
    const title = req.body.title;
    const start_time = req.body.startTime;
    console.log( start_time+":00" );
    const theater_name = req.body.theater_name.charAt(0);
    console.log( theater_name );

    const sql = `  select A.movie_id, A.title, B.start_time, C.theater_name, D.seat_name, D.reservation_status
            from movies A join showtimes B
            on A.movie_id = B.movie_id
            join theaters C 
            on B.theater_id = C.theater_id
            join seats D
            on B.theater_id = D.theater_id and B.start_time = D.start_time
            where A.title = "${title}" and B.start_time = '${start_time}' and C.theater_name="${theater_name}" and reservation_status = 1
        
        `
        db.query(sql, (err, dbData) => {
            if (err) {
                console.error(err); // 쿼리 오류 처리
                res.status(500).send('Database query error');
            } else {
                res.json(dbData); // 정상적으로 dbData를 클라이언트에 반환
            }
        });
    
});

app.post("/payment",(req,res)=>{
    console.log(req.body);
   const sql = `SELECT movie_id, title, img_path, 
                (SELECT adult_price FROM prices) as adult_price,
                (SELECT youth_price FROM prices) as youth_price,
                (SELECT special_price FROM prices) as special_price
                FROM movies
                WHERE title = "${req.body.title}"`;	

    db.query(sql, (err, dbData) => {
        if (err) {
            console.error(err); // 쿼리 오류 처리
            res.status(500).send('Database query error');
        } else {
		console.log(dbData)
            res.json(dbData); // 정상적으로 dbData를 클라이언트에 반환
        }
    });
	
})


app.post('/complete', (req, res) => {
    const data = {
        title: '플립',
        showtime: '13:10',
        theater: 'A',
        adult: '1',
        youth: '1',
        special: '1',
        seat_names: 'A1,B1,C1',
        phone_number: '01011112222', // 포인트 적립 안 하면 생략 가능
        movie_id: 1000005,
        reservation_id: 12345678901, //랜덤값 
        payment_method: 'both', //   결제방식, point or card or both 
        payment_amount: 20000, // 결제 금액
        use_point: 10000, // 사용한 포인트
        points_to_be_earned: 200, // '
        total_payment_amount: 10000 // 실제 결제 금액
    }

    //** 유저 포인트 적립 및 유저 테이블 추가 UPDATE, INSERT문 **/
    const sql_point_confirmation_popup = "SELECT point FROM users WHERE phone_number = ?"; // ? ==> 플레이스홀더
    db.query(sql_point_confirmation_popup, [data.phone_number], (err, results) => { //['0101111222'] ? 값 바인딩
        if (err) {
            console.err("쿼리실행 오류: 기존 포인트 조회"+err);
        } else {
            if (results.length > 0) {
                const currentPoints = results[0].point; // 현재 포인트 값
                const newPoints = currentPoints + data.points_to_be_earned; // 데이터에서 가져온 포인트 추가

                // UPDATE 문 실행 (파라미터화된 쿼리 사용)
                const sql_update_user_points = `UPDATE users SET point = ? WHERE phone_number = ?`;
                db.query(sql_update_user_points, [newPoints, data.phone_number], (err, results) => {
                    if (err) {
                        console.log("쿼리실행 오류: 포인트 업데이트", err);
                    } else {
                        console.log("포인트 업데이트 완료");
                    }
                });
            } else {
                console.log("해당 전화번호 사용자가 없으므로 인설트합니다.");

                const sql_insert_user_points = `insert into users values( ? , ? )`;
                db.query(sql_insert_user_points, [data.phone_number, data.points_to_be_earned], (err, results) => {
                    if (err) {
                        console.log("쿼리실행 오류: 신규유저 추가", err);
                    } else {
                        console.log("신규 유저 추가 완료");
                    }
                });
            }
        }
    });

    //** payments insert **/
    const sql_payment_insert = `insert into payments values( null,"${data.reservation_id}","${data.total_payment_amount}",now(),"${data.adult}","${data.use_point}" )`

    db.query(sql_payment_insert, (err, results) => {
        if (err) {
            console.log("쿼리실행 오류: payment 테이블 INSERT 실패!!", err);
        } else {
            console.log(results);
            console.log("payment 테이블 INSERT 성공!!");
        }
    });


    //** 유저 포인트 적립 및 유저 테이블 추가 UPDATE, INSERT문 **/
    const sql_complete_insert_reservations = `
    INSERT INTO reservations (
        reservation_num, phone_number, showtime, seat_names, theater_name, 
        adult_count, youth_count, special_count, title, movie_id, duration
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, (SELECT movie_id FROM movies WHERE title = ?), (SELECT duration FROM movies WHERE title = ?))
`;

    const values = [
        data.reservation_id,
        data.phone_number || null, // phone_number가 없을 경우 null 처리
        data.showtime,
        data.seat_names,
        data.theater,
        data.adult,
        data.youth,
        data.special,
        data.title, // title을 movie_id를 찾기 위한 서브쿼리에서 사용
        data.title, // 서브쿼리 안의 title 값 전달
        data.title // duration을 위한 서브쿼리에서 사용
    ];

    db.query(sql_complete_insert_reservations, values, (err, results) => {
        if (err) {
            console.log("쿼리실행 오류: reservations 테이블 INSERT 실패!!", err);
        } else {
            console.log(results);
            console.log("reservations 테이블 INSERT 성공!!");
        }
    });


})


//DONGHYUN DB ROUTING
/*******************************************************************/



// data 저장
let queryData = {};
let movieQueryData = {} // 오직 주환이만 씀 // Dont use this Object only can use Juhwan

/// ===페이지 이동=== ///

// EX) data = { content: "", sideBar: "", popup: "", bottomBar: "" }

// [touch_page] 화면을 터치해주세요  
app.get("/", (req, res) => {
    res.render("touch_page");
});

// [admin_password] 관리자 > 비밀번호 화면
app.get("/admin_password", (req, res) => {
    res.render("layout", { content: "content_admin_password", sideBar: "", popup: "", bottomBar: "bottomBarFrame", queryData: queryData });
});


// [home] 1. 현장예매 / 2. 예매티켓조회
app.get("/home", (req, res) => {
    res.render("layout", { content: "content_home", sideBar: "", popup: "", bottomBar: "bottomBarFrame", queryData: queryData });
});

// === 1. 현장예매 ===
// [content_movie_selection] 영화별/시간대별 선택
app.get("/movie_selection", (req, res) => {
    res.render("layout", { content: "content_movie_selection", sideBar: "sideBarFrame", popup: "", bottomBar: "bottomBarFrame", queryData: queryData });
});

// [content_select_movie_time] 상영시간선택
app.get("/select_movie_time", (req, res) => {
    const queryData = req.query;
    /* DONGHYUN */
	console.log("select_movie_time / get : "+ queryData);
    /* END DONGHYUN*/
    res.render("layout", { content: "content_select_movie_time", sideBar: "sideBarFrame", popup: "", bottomBar: "bottomBarFrame", queryData: queryData });
});


// === 2. 예매티켓조회 ===
// [content_ticket_info] 티켓정보
app.get("/ticket_info", (req, res) => {
	const queryData = req.query;
    res.render("layout", { content: "content_ticket_info", sideBar: "", popup: "", bottomBar: "bottomBarFrame", queryData: queryData });
});
// ===================
// app.get("/popup/:popupId", (req, res) => {
//     const popupId = req.params.popupId; // URL에서 경로 매개변수 'popupId'를 가져옵니다.
//     console.log(popupId);
    
//     res.render( "popup_layout", { popupContent: popupId } );
// });
// ===================

// [popup_select_headcount] 관람 인원 설정
app.get("/select_headcount", (req, res) => {
    const queryData = req.query;
    res.render("layout", { content: "", sideBar: "sideBarFrame", popup: "popup_select_headcount", bottomBar: "bottomBarFrame", queryData: queryData });
});

// [content_seat_selection] 좌석선택
app.get("/select_seat", (req, res) => {
    const queryData = req.query;
    res.render("layout", { content: "content_seat_selection", sideBar: "sideBarFrame", popup: "", bottomBar: "bottomBarFrame", queryData: queryData });
});

// [content_payment] 결제창
app.get("/payment", (req, res) => {
    const queryData = req.query;
    //movieQueryData = {...queryData};
    res.render("layout", { content: "content_payment", sideBar: "sideBarFrame", popup: "", bottomBar: "bottomBarFrame", queryData: queryData});
});

// ## 포인트 사용 ##

// [popup_user_verification] 회원번호 입력
app.get("/user_verification", (req, res) => {
    const queryData = req.query;
    res.render("layout", { content: "content_payment", sideBar: "sideBarFrame", popup: "popup_user_verification", bottomBar: "bottomBarFrame", queryData: queryData});
});

// [popup_point_confirmation] 사용 포인트 입력
app.get("/point_confirmation", (req, res) => {
    const queryData = req.query;
    res.render("layout", { content: "content_payment", sideBar: "sideBarFrame", popup: "popup_point_confirmation", bottomBar: "bottomBarFrame", queryData: queryData});
});

// ## 카드 결제 ## 
// [popup_payment_point_selection] 포인트를 적랍하시겠습니까?
app.get("/earn_point", (req, res) => {
    const queryData = req.query;
    movieQueryData = {...queryData};
    //res.render("layout", { content: "content_payment", sideBar: "sideBarFrame", popup: "popup_payment_point_selection", bottomBar: "bottomBarFrame", queryData: queryData });
    res.render("layout", { content: "content_payment", sideBar: "sideBarFrame", popup: "popup_payment_point_selection", bottomBar: "bottomBarFrame", queryData: queryData });
});

// [popup_payment_point_accumulation] 포인트 적립 번호 입력
app.get("/input_point", (req, res) => {
    res.render("layout", { content: "content_payment", sideBar: "sideBarFrame", popup: "popup_payment_point_accumulation", bottomBar: "bottomBarFrame", queryData: queryData });
});

// === 결제 공통 ===

 // [popup_payment_card_input] 카드 입력 대기 [setTimeout]
app.get("/buying", (req, res) => {
    const queryData = req.query;
    res.render("layout", { content: "", sideBar: "", popup: "popup_payment_card_input", bottomBar: "bottomBarFrame", queryData: queryData });
});

// [popup_payment_summary] 결제가 완료되었습니다 [setTimeout]
app.get("/show_payment", (req, res) => { 
    const queryData = req.query;
    res.render("layout", { content: "", sideBar: "", popup: "popup_payment_summary", bottomBar: "bottomBarFrame", queryData: queryData });
});

// [popup_ticket_print] 티켓 출력 
app.get("/printTicket", (req, res) => {
    res.render("layout", { content: "", sideBar: "", popup: "popup_ticket_print", bottomBar: "bottomBarFrame", movieQueryData: movieQueryData });
});

// [popup_complete] 결제완료 [setTimeout]
app.get("/complete", (req, res) => {
    res.render("layout", { content: "", sideBar: "", popup: "popup_complete", bottomBar: "bottomBarFrame" });
});
