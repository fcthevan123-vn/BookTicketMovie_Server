import db from "../app/models";

class SeatServices {
  async getSeatOverviewByShowId(showId) {
    try {
      // const detailShow = await db.Show.findOne({
      //   where: {
      //     id: showId,
      //   },
      //   include: [
      //     {
      //       model: db.MovieHall,
      //       include: [
      //         {
      //           model: db.RoomType,
      //         },
      //         {
      //           model: db.Cinema,
      //         },
      //         {
      //           model: db.Layout,
      //           include: [
      //             {
      //               model: db.Seat,
      //               include: [
      //                 {
      //                   model: db.SeatType,
      //                 },
      //                 {
      //                   model: db.SeatStatus,
      //                 },
      //               ],
      //             },
      //           ],
      //         },
      //       ],
      //     },

      //     {
      //       model: db.Movie,
      //     },
      //   ],
      // });

      const detailShow = await db.Show.findOne({
        where: {
          id: showId,
        },
        include: [
          {
            model: db.MovieHall,
            include: [
              {
                model: db.RoomType,
              },
              {
                model: db.Cinema,
              },
              {
                model: db.Layout,
                include: [
                  {
                    model: db.Seat,
                    include: [
                      {
                        model: db.SeatType,
                      },
                      // {
                      //   model: db.SeatStatus,
                      // },
                    ],
                  },
                ],
              },
            ],
          },

          {
            model: db.Movie,
          },
        ],
      });

      if (!detailShow) {
        return {
          statusCode: 1,
          message: "Không tìm thấy ghế",
        };
      }

      const allSeats = await db.SeatStatus.findAll({
        where: {
          showId: showId,
        },
        include: [
          {
            model: db.Seat,
            // where: {
            //   layoutId: detailShow.MovieHall.Layout.id,
            // },
            include: [
              {
                model: db.SeatType,
              },
            ],
          },
        ],
      });

      return {
        statusCode: 0,
        message: "Lấy seats thành công",
        data: detailShow,
        seatPicked: allSeats,
      };
    } catch (error) {
      console.error("Error while fetching shows:", error);
      return {
        statusCode: -1,
        message: "Lỗi trong quá trình lấy dữ liệu show",
      };
    }
  }
}

export default new SeatServices();
