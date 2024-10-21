const sqlCommand = {
    movie_selection1 : `SELECT * FROM movies WHERE 1`,
    movie_selection2 : `SELECT B.movie_id, B.duration, B.title, A.start_time, B.img_path FROM showtimes A JOIN movies B ON A.movie_id = B.movie_id`,
    checkUser: `select M.movie_id, M.duration, M.title, R.showtime, (R.adult_count + R.youth_count + special_count) ticket_count, R.seat_names, M.img_path 
    from reservations R join movies M on R.movie_id = M.movie_id where reservation_num = ?;`,
    checkPhoneNumber :`select * from users where phone_number = ?`,
    select_movie_time : `select B.movie_id, B.duration, B.title,  A.start_time, B.img_path, C.theater_name,
            C.total_seats,
            (select count(*) from seats D where reservation_status = 0 and A.start_time = D.start_time and B.movie_id = D.movie_id) as reservable_seats
            from showtimes A
            join movies B
            on A.movie_id = B.movie_id
            join theaters C
            on C.theater_id = A.theater_id
            where B.title = ?
	    order by start_time;`,
    select_seat: `select A.movie_id, A.title, B.start_time, C.theater_name, D.seat_name, D.reservation_status from movies A join showtimes B on A.movie_id = B.movie_id join theaters C on B.theater_id = C.theater_id join seats D on B.theater_id = D.theater_id and B.start_time = D.start_time where A.title = ? and B.start_time = ? and C.theater_name= ? and reservation_status = 1`,
    payment: `SELECT movie_id, title, img_path, 
                (SELECT adult_price FROM prices) as adult_price,
                (SELECT youth_price FROM prices) as youth_price,
                (SELECT special_price FROM prices) as special_price
                FROM movies
                WHERE title = ?`,
    content_sales_status : `select title,sum(total_payment_amount) amount,sum(adult_count + youth_count + special_count) audience_count from payments P left join reservations R on P.reservation_num = R.reservation_num group by title`,
}

export default sqlCommand;