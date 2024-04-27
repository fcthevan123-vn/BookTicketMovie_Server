/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
"use strict";
const { v4: uuidv4 } = require("uuid");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Movies",
      [
        {
          id: "cb957577-9305-42cd-a45c-1b4dbad64394",
          discountId: "2843ce4a-2caa-462a-b4ee-eb2d1661e2b1",
          title: "GODZILLA x KONG: ĐẾ CHẾ MỚI",
          description:
            "Kong và Godzilla - hai sinh vật vĩ đại huyền thoại, hai kẻ thủ truyền kiếp sẽ cùng bắt tay thực thi một sứ mệnh chung mang tính sống còn để bảo vệ nhân loại, và trận chiến gắn kết chúng với loài người mãi mãi sẽ bắt đầu.",
          directors: ["Adam Wingard"],
          actors: [
            "Rebecca Hall",
            "Brian Tyree Henry",
            "Dan Stevens",
            "Kaylee Hottle",
          ],
          language: "Anh",
          country: "Anh",
          subtitle: "Việt Nam",
          releaseDate: "2024-04-18",
          endDate: "2024-05-31",
          images: [
            "https://show-booking.s3.amazonaws.com/2310b3391764d97d6963",
            "https://show-booking.s3.amazonaws.com/764833d5845e1a7280e0",
            "https://show-booking.s3.amazonaws.com/5dbc3db0427f8af1e797",
            "https://show-booking.s3.amazonaws.com/e818f2c863fc4c3b86d3",
          ],
          genre: ["Hành động", "Kịch tính", "Giả tưởng"],
          duration: 115,
          ageRequire: "K",
          trailerLink:
            "https://show-booking.s3.amazonaws.com/00a2d0aceb917386f7af",
          countBooked: 0,
          createdAt: "2024-04-18T22:48:07.651Z",
          updatedAt: "2024-04-18T23:39:37.950Z",
        },
        {
          id: "8adbd75f-f353-400d-838e-d85d8ba03e11",
          discountId: null,
          title: "THANH XUÂN 18x2: LỮ TRÌNH HƯỚNG VỀ EM",
          description:
            "Ký ức tình đầu ùa về khi Jimmy nhận được tấm bưu thiếp từ Ami. Cậu quyết định một mình bước lên chuyến tàu đến Nhật Bản gặp lại người con gái cậu đã bỏ lỡ 18 năm trước. Mối tình day dứt thời thanh xuân, liệu sẽ có một kết cục nào tốt đẹp khi đoàn tụ?",
          directors: ["Fujii Michihito"],
          actors: ["Greg Hsu", "Kaya Kiyohara", "Chang Chen", "Kuroki Hitomi"],
          language: "Trung Quốc",
          country: "Trung Quốc",
          subtitle: "Việt Nam",
          releaseDate: "2024-04-17",
          endDate: "2024-05-08",
          images: [
            "https://show-booking.s3.amazonaws.com/1a0fba89177a0a7332cd",
            "https://show-booking.s3.amazonaws.com/b0c5df4704ca71c94ebe",
            "https://show-booking.s3.amazonaws.com/ae0e0c414f2ddd79b56b",
            "https://show-booking.s3.amazonaws.com/262a3f6268ee5b9ecfb2",
          ],
          genre: ["Lãng mạn", "Kịch tính", "Tuổi teen"],
          duration: 123,
          ageRequire: "K",
          trailerLink:
            "https://show-booking.s3.amazonaws.com/00a2d0aceb917386f7af",
          countBooked: 0,
          createdAt: "2024-04-18T22:50:59.925Z",
          updatedAt: "2024-04-18T22:52:03.427Z",
        },
        {
          id: "7dd3e3ee-ecd4-4af3-908e-9ee76f127844",
          discountId: null,
          title: "KUNG FU PANDA 4",
          description:
            "Sau khi Po được chọn trở thành Thủ lĩnh tinh thần của Thung lũng Bình Yên, Po cần tìm và huấn luyện một Chiến binh Rồng mới, trong khi đó một mụ phù thủy độc ác lên kế hoạch triệu hồi lại tất cả những kẻ phản diện mà Po đã đánh bại về cõi linh hồn.",
          directors: ["Mike Mitchell"],
          actors: ["Jack Black", "Dustin Hoffman", "James Hong", "Awkwafina"],
          language: "Anh",
          country: "Trung Quốc",
          subtitle: "Việt Nam",
          releaseDate: "2024-04-16",
          endDate: "2024-05-07",
          images: [
            "https://show-booking.s3.amazonaws.com/656bf0a38b6138bd8eb1",
            "https://show-booking.s3.amazonaws.com/cc2944a845798a724e02",
            "https://show-booking.s3.amazonaws.com/f1b50ea5ecb253402dd5",
          ],
          genre: ["Hành động", "Giả tưởng", "Hoạt hình"],
          duration: 94,
          ageRequire: "K",
          trailerLink:
            "https://show-booking.s3.amazonaws.com/00a2d0aceb917386f7af",
          countBooked: 0,
          createdAt: "2024-04-18T22:58:41.168Z",
          updatedAt: "2024-04-18T22:58:41.168Z",
        },
        {
          id: "7ababd69-642f-499b-98b8-0eeb591fb89b",
          discountId: null,
          title: "EXHUMA: QUẬT MỘ TRÙNG MA",
          description:
            "Hai pháp sư, một thầy phong thuỷ và một chuyên gia khâm liệm cùng hợp lực khai quật ngôi mộ bị nguyền rủa của một gia đình giàu có, nhằm cứu lấy sinh mạng hậu duệ cuối cùng trong dòng tộc. Bí mật hắc ám của tổ tiên được đánh thức.",
          directors: ["Jang Jae Hyun"],
          actors: ["Choi Min Sik", "Yoo Hai Jin", "Kim Go Eun", "Lee Do Hyun"],
          language: "Hàn Quốc",
          country: "Hàn Quốc",
          subtitle: "Việt Nam",
          releaseDate: "2024-04-15",
          endDate: "2024-06-19",
          images: [
            "https://show-booking.s3.amazonaws.com/4e17cc22224e8a8639b4",
            "https://show-booking.s3.amazonaws.com/bea55aacc1de23e96d16",
            "https://show-booking.s3.amazonaws.com/a5c62c971e6166f99bb3",
            "https://show-booking.s3.amazonaws.com/d64a22fc51d6e8467a54",
          ],
          genre: ["Hành động", "Kinh dị", "Chiến tranh"],
          duration: 133,
          ageRequire: "K",
          trailerLink:
            "https://show-booking.s3.amazonaws.com/00a2d0aceb917386f7af",
          countBooked: 0,
          createdAt: "2024-04-18T23:08:20.557Z",
          updatedAt: "2024-04-18T23:08:20.557Z",
        },
        {
          id: "1ce2c985-20d1-40a8-bfbb-34e5fa90d18e",
          discountId: null,
          title: "VÂY HÃM: KẺ TRỪNG PHẠT",
          description:
            "Siêu cớm Ma Seok-do tái xuất để đối đầu với những tội phạm tinh vi trong giới công nghệ. Nắm đấm trứ danh liệu có phát huy được sức mạnh trước liên minh tội phạm của thiên tài công nghệ và ông trùm nhà cái lớn nhất châu Á?",
          directors: ["Heo Myeong Haeng"],
          actors: ["Ma Dong-seok", "Kim Mu-yeol", "Lee Joo-bin"],
          language: "Hàn Quốc",
          country: "Hàn Quốc",
          subtitle: "Việt Nam",
          releaseDate: "2024-04-20",
          endDate: "2024-05-24",
          images: [
            "https://show-booking.s3.amazonaws.com/165d7154c099336d952f",
            "https://show-booking.s3.amazonaws.com/bdcc9f2c6638b1a10ce8",
            "https://show-booking.s3.amazonaws.com/943eb93e952996c7f597",
            "https://show-booking.s3.amazonaws.com/019ad5d3b58e8aa8d462",
          ],
          genre: ["Hành động", "Kịch tính", "Tội phạm"],
          duration: 106,
          ageRequire: "K",
          trailerLink:
            "https://show-booking.s3.amazonaws.com/00a2d0aceb917386f7af",
          countBooked: 0,
          createdAt: "2024-04-18T23:12:41.859Z",
          updatedAt: "2024-04-18T23:12:41.859Z",
        },
        {
          id: "a4dda645-f9cd-487c-a774-5b26dfcb022c",
          discountId: null,
          title: "ANH HÙNG BÀN PHÍM",
          description:
            "Im Sang-jin - một phóng viên mảng xã hội đã bị đình chỉ công tác sau bài phóng sự điều tra sai lệch về những lùm xùm của tập đoàn Manjun. Tưởng rằng phải chịu nỗi oan ức suốt đời, Im Sang-jin bất ngờ nhận được thông tin ẩn danh khẳng định anh không sai, mà mọi thứ đã bị thao túng bởi một “đội quân” trực tuyến: Chỉ cần có tiền, sự thật nào cũng hoá thành dối lừa, còn tin tức giả lại hoá thành sự thật.",
          directors: ["Ahn Guk Jin"],
          actors: ["Son Sukku", "Kim Sung-Cheol", "Kim Dong-Hwi", "Hong Kyung"],
          language: "Hàn Quốc",
          country: "Hàn Quốc",
          subtitle: "Việt Nam",
          releaseDate: "2024-04-20",
          endDate: "2024-05-08",
          images: [
            "https://show-booking.s3.amazonaws.com/fcc26b63543e2f0d4439",
            "https://show-booking.s3.amazonaws.com/8455ad8ef87291f45c20",
          ],
          genre: ["Kịch tính", "Fantasy", "Phiêu lưu"],
          duration: 106,
          ageRequire: "K",
          trailerLink:
            "https://show-booking.s3.amazonaws.com/00a2d0aceb917386f7af",
          countBooked: 0,
          createdAt: "2024-04-18T23:15:41.004Z",
          updatedAt: "2024-04-18T23:15:41.004Z",
        },
        {
          id: "965cf9ac-6224-42ac-abe2-ee427ad0e6d1",
          discountId: null,
          title: "CÁI GIÁ CỦA HẠNH PHÚC",
          description:
            "Bà Dương và ông Thoại luôn cố gắng để xây dựng một hình ảnh gia đình tài giỏi và danh giá trong mắt mọi người. Tuy nhiên dưới lớp vỏ bọc hào nhoáng ấy là những biến cố và lục đục gia đình đầy sóng gió. Nhìn kĩ hơn một chút bức tranh gia đình hạnh phúc ấy, rất nhiều “khuyết điểm” sẽ lộ ra gây bất ngờ.",
          directors: ["Nguyễn Ngọc Lâm"],
          actors: [
            "Xuân Lan",
            "Thái Hoà",
            "Lâm Thanh Nhã",
            "Uyển Ân",
            "Hữu Châu",
            "Trâm Anh",
          ],
          language: "Việt Nam",
          country: "Việt Nam",
          subtitle: "Anh",
          releaseDate: "2024-04-20",
          endDate: "2024-05-04",
          images: [
            "https://show-booking.s3.amazonaws.com/1ace96e5c51135911907",
            "https://show-booking.s3.amazonaws.com/87cfe1b48f87fd9293da",
            "https://show-booking.s3.amazonaws.com/a13ce9d82c3950fa00ea",
          ],
          genre: ["Kịch tính", "Hài kịch", "Gia đình"],
          duration: 115,
          ageRequire: "K",
          trailerLink:
            "https://show-booking.s3.amazonaws.com/00a2d0aceb917386f7af",
          countBooked: 0,
          createdAt: "2024-04-18T23:19:03.187Z",
          updatedAt: "2024-04-18T23:19:03.187Z",
        },
        {
          id: "41f6b319-04b6-4e69-afac-c61a74ba3507",
          discountId: null,
          title: "MÙA HÈ CỦA LUCA",
          description:
            '"Mùa Hè Của Luca" kể về chuyến hành trình của cậu bé Luca tại hòn đảo Portorosso thuộc vùng biển Địa Trung Hải ở Ý tuyệt đẹp. Ở đây cậu đã làm quen và kết thân với những người bạn nhỏ mới và tận hưởng mùa hè đầy nắng, kem Gelato và cả món mì Ý trứ danh. Tuy nhiên có một điều không ổn lắm, Luca là một THỦY QUÁI và những người dân trên hòn đảo này lại không thích điều này chút nào.',
          directors: ["Michael Mohan"],
          actors: ["Sydney Sweeney", "Álvaro Morte", "Simona Tabasco"],
          language: "Anh",
          country: "Anh",
          subtitle: "Việt Nam",
          releaseDate: "2024-04-20",
          endDate: "2024-05-05",
          images: [
            "https://show-booking.s3.amazonaws.com/78371d31752183c62f52",
            "https://show-booking.s3.amazonaws.com/489801a0a211244be4dc",
          ],
          genre: ["Hành động", "Kinh dị", "Bí ẩn"],
          duration: 85,
          ageRequire: "K",
          trailerLink:
            "https://show-booking.s3.amazonaws.com/00a2d0aceb917386f7af",
          countBooked: 0,
          createdAt: "2024-04-18T23:24:15.682Z",
          updatedAt: "2024-04-18T23:24:15.682Z",
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
