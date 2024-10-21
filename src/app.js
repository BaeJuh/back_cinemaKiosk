import { log } from "console";
import express from "express";
import mysql from "mysql";
import path from "path";
/* DONGHYUN*/
import sqlCommand from "./sqlTemplate/sqlCommand.js"
import dbconfig from './config/dbconfig.js';
const db = mysql.createConnection(dbconfig);
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
    db.query(sqlCommand.movie_selection1, (err, dbData) => {
        if (err) {
            console.error(err); // 쿼리 오류 처리
            res.status(500).send('Database query error');
        } else {
            res.json(dbData);
        }
    });
});

app.post("/movie_selection2", (req, res) => {
    db.query(sqlCommand.movie_selection2, (err, dbData) => {
        if (err) {
            console.error(err); // 쿼리 오류 처리
            res.status(500).send('Database query error');
        } else {
            res.json(dbData);
        }
    });
});

app.post("/checkUser", (req, res) => {
    const checkInformation = req.body.checkInformation;
    const values = [checkInformation];
    db.query(sqlCommand.checkUser, values, (err, dbData) => {
        if (err) {
            console.error(err); // 쿼리 오류 처리
            res.status(500).send('Database query error');
        } else {
            if (dbData && dbData.length > 0) {
                res.json(dbData);
                console.log("예약된 정보가 있다.");
            } else {
                console.log("예약된 정보가 없다.");
                res.json("no reservation");
            }
        }
    });
});

app.post("/user_verification_popup", (req, res) => {
    console.log(req.body.checkInformation)
    const checkInformation = req.body.checkInformation;
    const values = [checkInformation];

    db.query(sqlCommand.checkPhoneNumber, values, (err, dbData) => {
        if (err) {
            console.error(err); // 쿼리 오류 처리
            res.status(500).send('Database query error');
        } else {
            if (dbData && dbData.length > 0) {
                console.log("user_verification_popup 유저 데이터 있다.");
                res.json("유저 데이터 있다");
            } else {
                console.log("user_verification_popup 유저 데이터 없다.");
            }
        }
    });
});

app.post("/point_confirmation_popup", (req, res) => {
    console.log(req.body.checkInformation)
    const checkInformation = req.body.checkInformation;
    const values = [checkInformation];
    db.query(sqlCommand.checkPhoneNumber, values, (err, dbData) => {
        if (err) {
            console.error(err); // 쿼리 오류 처리
            res.status(500).send('Database query error');
        } else {
            res.json(dbData);
        }
    });
});

// app.post("/payment_point_accumulation_popup", (req, res) => {
//     console.log(req.body.checkInformation)
//     const checkInformation = req.body.checkInformation;
//     const values = [checkInformation];
//     db.query(sqlCommand.checkPhoneNumber, values, (err, dbData) => {
//         if (err) {
//             console.error(err); // 쿼리 오류 처리
//             res.status(500).send('Database query error');
//         } else {
//             if (dbData && dbData.length > 0) {
//                 console.log("user_verification_popup 유저 데이터 있다.");
//                 res.json("유저 데이터 있다");
//             } else {
//                 console.log("user_verification_popup 유저 데이터 없다.");
//                 res.json("유저 데이터 없다");
//             }
//         }
//     });
// });

app.post("/select_movie_time", (req, res) => {
    const title = req.body.title;
    const values = [title];

    db.query(sqlCommand.select_movie_time, values, (err, dbData) => {
        if (err) {
            console.error(err); // 쿼리 오류 처리
            res.status(500).send('Database query error');
        } else {
            res.json(dbData);
        }
    });
});

app.post("/select_seat", (req, res) => {
    const title = req.body.title;
    const start_time = req.body.startTime;
    const theater_name = req.body.theater_name.charAt(0);
    const values = [title, start_time, theater_name];
    db.query(sqlCommand.select_seat, values, (err, dbData) => {

        if (err) {
            console.error(err); // 쿼리 오류 처리
            res.status(500).send('Database query error');
        } else {
            res.json(dbData);
        }
    });
});



app.post("/payment", (req, res) => {
    const title = req.body.title;
    const values = [title];
    db.query(sqlCommand.payment, values, (err, dbData) => {
        if (err) {
            console.error(err); // 쿼리 오류 처리
            res.status(500).send('Database query error');
        } else {
            res.json(dbData);
        }
    });

})

app.post("/content_sales_status", (req, res) => {
    db.query(sqlCommand.content_sales_status, (err, dbData) => {
        if (err) {
            console.log("content_sales_status DB SELECT 오류 : " + err)
        } else {
            res.json(dbData)
        }
    })
})

app.post('/complete', (req, res) => {

    console.log("*******************************complete 로그 : **********************************");
    console.log(req.body);
    console.log("*******************************complete 로그 : **********************************");

    const data = req.body;
    data["theater_name"] = data["theater_name"].charAt(0);
    // const data = {
    //     title: '나 홀로 집에1',
    //     showtime: '22:00',
    //     theater: 'A',
    //     adult: '1',
    //     youth: '1',
    //     special: '1',
    //     seat_names: 'A1,B1,C1',
    //     phone_number: '01011112222', // 포인트 적립 안 하면 생략 가능
    //     movie_id: 1000005,
    //     reservation_id: 12345678901, //랜덤값 
    //     payment_method: 'both', //   결제방식, point or card or both 
    //     payment_amount: 20000, // 결제 금액
    //     use_point: 1000, // 사용한 포인트
    //     points_to_be_earned: 200, // '
    //     total_payment_amount: 19000 // 실제 결제 금액
    // }

    //** UPDATE SEAT_TABLE (예약좌석 사용 불가능으로 업데이트 )**/
    const seats = data.seat_names.split(",");
    seats.forEach((seat, i, a) => {
        const sql_seat_update = `update seats set reservation_status = 1 
            where seat_name = "${seat}" 
            and start_time = "${data.startTime}" 
            and theater_id = (select theater_id from theaters where theater_name = "${data.theater_name}")`

        db.query(sql_seat_update, (err, results) => {
            if (err) {
                console.log("쿼리실행 오류: seats 테이블 update 실패!!", err);
            } else {
                console.log("seats 테이블 update 성공!!");
            }
        });

    });

    //** UPDATE, INSERT USER_TABLE (기존 유저 포인트 적립 및 신규 유저 추가) **/
    if (data.phone_number != 'null') {
        const sql_point_confirmation_popup = "SELECT point FROM users WHERE phone_number = ?"; // ? ==> 플레이스홀더
        db.query(sql_point_confirmation_popup, [data.phone_number], (err, results) => { //['0101111222'] ? 값 바인딩
            if (err) {
                console.err("쿼리실행 오류: 기존 포인트 조회" + err);
            } else {
                if (results.length > 0) {
                    const currentPoints = results[0].point; // 현재 포인트 값
                    const newPoints = Number(currentPoints) + Number(data.points_to_be_earned); // 데이터에서 가져온 포인트 추가

                    // UPDATE 문 
                    const sql_update_user_points = `UPDATE users SET point = ? WHERE phone_number = ?`;
                    db.query(sql_update_user_points, [newPoints, data.phone_number], (err, results) => {
                        if (err) {
                            console.log("쿼리실행 오류: 포인트 업데이트", err);
                        } else {
                            console.log("기존 유저 적립 포인트 업데이트 완료");
                        }
                    });
                } else {
                    console.log("해당 전화번호 사용자가 없으므로 인설트합니다.");
                    const sql_insert_user_points = `insert into users values( null, ? , ? )`;
                    db.query(sql_insert_user_points, [data.phone_number, Number(data.points_to_be_earned)], (err, results) => {
                        if (err) {
                            console.log("쿼리실행 오류: 신규유저 추가", err);
                        } else {
                            console.log("신규 유저 추가 완료");
                        }
                    });
                }
            }
        });
    }

    //** INSERT PAYMENTS TABLE ( 매출관리 테이블 데이터 추가 ) **/
    const sql_payment_insert = `insert into payments values( null,"${data.reservation_id}","${data.total_payment_amount}",now(),null,0 )`

    db.query(sql_payment_insert, (err, results) => {
        if (err) {
            console.log("쿼리실행 오류: payment 테이블 INSERT 실패!!", err);
        } else {
            console.log(results);
            console.log("payment 테이블 INSERT 성공!!");
        }
    });


    //** INSERT RESERVATIONS TABLE ( 예약 정보 추가 ) **/
    const sql_complete_insert_reservations = `
        INSERT INTO reservations (
            reservation_num, phone_number, showtime, seat_names, theater_name, 
            adult_count, youth_count, special_count, title, movie_id, duration
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, (SELECT movie_id FROM movies WHERE title = ?), (SELECT duration FROM movies WHERE title = ?))
    `;

    const values = [
        data.reservation_id,
        data.phone_number || null, // phone_number가 없을 경우 null 처리
        data.startTime,
        data.seat_names,
        data.theater_name,
        data.adult,
        data.youth,
        data.special,
        data.title,
        data.title,
        data.title
    ];

    db.query(sql_complete_insert_reservations, values, (err, results) => {
        if (err) {
            console.log("쿼리실행 오류: reservations 테이블 INSERT 실패!!", err);
        } else {
            console.log(results);
            console.log("reservations 테이블 INSERT 성공!!");
        }
    });
    /** UPDATE USER_TABLE  (유저 사용 포인트 차감)  **/
    if (data.use_point != 'null') {
        console.log("UPDATE USER_TABLE  (유저 사용 포인트 차감)");
        const sql = `select point from users where phone_number="${data.phone_number}"`;
        let leftPoint = 0;
        db.query(sql, (err, dbData) => {
            if (err) {
                console.error(err);
            } else {
                leftPoint = Number(dbData[0]["point"]) - Number(data.use_point);
                console.log(leftPoint);
                const updateSql = `update users set point=${leftPoint} where phone_number =${data.phone_number}`
                console.log(updateSql);
                db.query(updateSql, (err, dbResult) => {
                    if (err) {
                        console.log("userupate_Err")
                        console.error(err)
                    } else {
                        console.log("users 사용포인트 업데이트");
                        console.log(dbResult);
                    }
                })
            }
        });
    }
    res.json("END!!!!")
});


//DONGHYUN DB ROUTING
/*******************************************************************/



// data 저장
let queryData = {};
let movieQueryData = {} // 오직 주환이만 씀 // Dont use this Object only can use Juhwan

/// ===페이지 이동=== ///

// EX) data = { content: "", sideBar: "", popup: "", bottomBar: "" }

// [touch_page] 화면을 터치해주세요  
app.get("/", (req, res) => {
    res.render("touch_page_final");
});


/* DONGHYUN 추가 */
app.get('/content_sales_status', (req, res) => {
    //res.render("content_sales_status");
    res.render("layout", { content: "managePage", sideBar: "", popup: "", bottomBar: "bottomBarFrame", queryData: queryData});
});

/* DONGHYUN 추가*/

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
    res.render("layout", { content: "content_payment", sideBar: "sideBarFrame", popup: "", bottomBar: "bottomBarFrame", queryData: queryData });
});

// ## 포인트 사용 ##

// [popup_user_verification] 회원번호 입력
app.get("/user_verification", (req, res) => {
    const queryData = req.query;
    res.render("layout", { content: "content_payment", sideBar: "sideBarFrame", popup: "popup_user_verification", bottomBar: "bottomBarFrame", queryData: queryData });
});


// [popup_point_confirmation] 사용 포인트 입력
app.get("/point_confirmation", (req, res) => {
    const queryData = req.query;
    res.render("layout", { content: "content_payment", sideBar: "sideBarFrame", popup: "popup_point_confirmation", bottomBar: "bottomBarFrame", queryData: queryData });
});

// ## 카드 결제 ## 
// [popup_payment_point_selection] 포인트를 적랍하시겠습니까?
app.get("/earn_point", (req, res) => {
    const queryData = req.query;

    //res.render("layout", { content: "content_payment", sideBar: "sideBarFrame", popup: "popup_payment_point_selection", bottomBar: "bottomBarFrame", queryData: queryData });
    res.render("layout", { content: "content_payment", sideBar: "sideBarFrame", popup: "popup_payment_point_selection", bottomBar: "bottomBarFrame", queryData: queryData });
});

// [popup_payment_point_accumulation] 포인트 적립 번호 입력
app.get("/input_point", (req, res) => {
    const queryData = req.query;
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
    movieQueryData = { ...queryData };
    res.render("layout", { content: "", sideBar: "", popup: "popup_payment_summary", bottomBar: "bottomBarFrame", queryData: queryData });
});

// [popup_ticket_print] 티켓 출력 
app.get("/printTicket", (req, res) => {
    const queryData = req.query;
    res.render("layout", { content: "", sideBar: "", popup: "popup_ticket_print", bottomBar: "bottomBarFrame", movieQueryData: movieQueryData });
});

// [popup_complete] 결제완료 [setTimeout]
app.get("/complete", (req, res) => {
    res.render("layout", { content: "", sideBar: "", popup: "popup_complete", bottomBar: "bottomBarFrame" });
});
