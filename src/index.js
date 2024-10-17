import express, { query } from "express";
import mysql from "mysql";
import path from "path";


const app = express();

app.use(express.static("public"));

app.set("view engine", "ejs");
app.set("views", "view");
app.set('views', path.join(__dirname, 'views'));

app.listen(3000, () => {
    console.log("3000 Port is ready");
});

/// ===페이지 이동=== ///

// 화면을 터치해주세요
app.get("/", (req, res) => {
    res.render("touch_page");
});

// adminBtn 눌렀을 경우
app.get("/admin_password", (req, res) => {
    res.render("/admin_password");
});

// home (현장예매, 예매티켓조회)
app.get("/home", (req, res) => {
    res.render("home");
});

// 영화별/시간대별 선택
app.get("/movie_selection", (req, res) => {
    res.render("movie_time_selection");
});

// 상영시간선택
app.get("/select_movie_time", (req, res) => {
    res.render("select_movie_time_popup");
});

// 관람 인원 설정
app.get(`/select_headcount_popup`, (req, res) => {
    console.log(req.query);
    console.log(typeof req.query);
    const movieData = req.query;
    res.render("select_headcount_popup", { movieData: movieData });
    // res.render("select_headcount_popup"); // 임시
});

// 좌석선택
app.get("/select_seat", (req, res) => {
    res.render("seat_selectionA");
});

// ### 결제창 ###
app.get("/payment", (req, res) => {
    res.render("payment");
});

// ## 포인트 사용 ##

// 회원번호 입력
app.get("/user_verification", (req, res) => {
    res.render("user_verification_popup");
});

// 사용 포인트 입력
app.get("/point_confirmation", (req, res) => {
    res.render("point_confirmation_popup");
});

// ## 카드 결제 ## 
app.get("/earn_point", (req, res) => {
    res.render("payment_point_selection_popup"); 
});

// 포인트 적립을 위한 번호 넣기
app.get("/input_point", (req, res) => {
    res.render("payment_point_accumulation_popup"); 
});

// === 결제 공통 ===

 // 카드 입력 대기 [setTimeout]
app.get("/buying", (req, res) => {
    res.render("payment_card_input_popup");
});

// 결제가 완료되었습니다 [setTimeout]
app.get("/show_payment", (req, res) => { 
    res.render("payment_summary_popup");
});

// 티켓 출력 
app.get("/printTicket", (req, res) => {
    res.render("ticket_print_popup"); 
});

// 결제완료 [setTimeout]
app.get("/complete", (req, res) => {
    res.render("complete");
});

app.get("/test", (req, res) => {
    res.render("layout");
});
