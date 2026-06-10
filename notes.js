

// the first command to create this project was: npm install express mongoose dotenv morgan cors helmet bcryptjs jsonwebtoken express-validator
// reviews🧮 [
//   {
//     _id: ObjectId('690a535bb347d907343b8d1a'),
//     pointOfSaleId: '690a697ffae7250165fc967c',
//     userId: ObjectId('690a083084db5cd908530bba'),
//     rating: 4,
//     comment: 'This is our second visit to this place, we brought more friends to give a try! Definitely worth it',
//     ownerReply: "We're glad you had such a lovely experience! Visit us again!",
//     visitedAt: ISODate('2025-11-04T19:26:19.251Z'),
//     ownerReplyDate: ISODate('2025-11-04T19:26:19.251Z'),
//     createdAt: ISODate('2025-11-04T19:26:19.252Z'),
//     updatedAt: ISODate('2025-11-04T19:26:19.252Z'),
//     __v: 0
//   },
//   {
//     _id: ObjectId('690a6fadbcdc54b1b43438c5'),
//     pointOfSaleId: ObjectId('690a694ffae7250165fc9679'),
//     userId: ObjectId('690a0aa884db5cd908530bc6'),
//     rating: 3,
//     comment: 'Perfect place for a family dinner. Kids loved it! The portions are generous and the service was outstanding. The waiter even brought crayons for the kids. Highly recommend!',
//     visitedAt: ISODate('2025-11-04T21:27:09.758Z'),
//     ownerReplyDate: ISODate('2025-11-04T21:27:09.758Z'),
//     createdAt: ISODate('2025-11-04T21:27:09.766Z'),
//     updatedAt: ISODate('2025-11-08T22:35:13.876Z'),
//     __v: 0,
//     ownerReply: '\nIt was great having you here!'
//   },
//   {
//     _id: ObjectId('690fc16eb96064ccc68b9d84'),
//     pointOfSaleId: ObjectId('690a697ffae7250165fc967c'),
//     userId: ObjectId('690a0aa884db5cd908530bc6'),
//     rating: 4,
//     comment: 'Perfect place for a family dinner. Kids loved it! The portions are generous and the service was outstanding. The waiter even brought crayons for the kids. Highly recommend!',
//     visitedAt: ISODate('2025-11-08T22:17:18.294Z'),
//     ownerReplyDate: ISODate('2025-11-08T22:17:18.294Z'),
//     createdAt: ISODate('2025-11-08T22:17:18.294Z'),
//     updatedAt: ISODate('2025-11-08T22:38:22.197Z'),
//     __v: 0,
//     ownerReply: 'oij\n'
//   },
//   {
//     _id: ObjectId('690fc16fb96064ccc68b9d89'),
//     pointOfSaleId: ObjectId('690a697ffae7250165fc967c'),
//     userId: ObjectId('690a0aa884db5cd908530bc6'),
//     rating: 4,
//     comment: 'Perfect place for a family dinner. Kids loved it! The portions are generous and the service was outstanding. The waiter even brought crayons for the kids. Highly recommend!',
//     visitedAt: ISODate('2025-11-08T22:17:19.955Z'),
//     ownerReplyDate: ISODate('2025-11-08T22:17:19.955Z'),
//     createdAt: ISODate('2025-11-08T22:17:19.955Z'),
//     updatedAt: ISODate('2025-11-08T22:17:19.955Z'),
//     __v: 0
//   },
//   {
//     _id: ObjectId('690a52f2b347d907343b8d15'),
//     pointOfSaleId: '690a697ffae7250165fc967c',
//     userId: ObjectId('690a083084db5cd908530bba'),
//     rating: 4.4,
//     comment: 'It is one of the best places I have visited in the city',
//     ownerReply: "We're glad you had such a lovely experience! Visit us again!",
//     visitedAt: ISODate('2025-11-04T19:24:34.948Z'),
//     ownerReplyDate: ISODate('2025-11-04T19:24:34.948Z'),
//     createdAt: ISODate('2025-11-04T19:24:34.957Z'),
//     updatedAt: ISODate('2025-11-04T19:24:34.957Z'),
//     __v: 0
//   },
//   {
//     _id: ObjectId('690a54a7b347d907343b8d29'),
//     pointOfSaleId: '690a697ffae7250165fc967c',
//     userId: ObjectId('690a0aee84db5cd908530bca'),
//     rating: 4,
//     comment: "Best burgers in town! The bacon cheeseburger is incredible - perfectly cooked, juicy, and loaded with flavor. The fries are crispy and well-seasoned. Can't wait to come back!",
//     visitedAt: ISODate('2025-11-04T19:31:51.540Z'),
//     ownerReplyDate: ISODate('2025-11-04T19:31:51.540Z'),
//     createdAt: ISODate('2025-11-04T19:31:51.542Z'),
//     updatedAt: ISODate('2025-11-05T00:45:03.133Z'),
//     __v: 0,
//     ownerReply: 'It will be a pleasure to have you here in the futur!'
//   },
//   {
//     _id: ObjectId('690a72173541c3751e334f28'),
//     pointOfSaleId: ObjectId('690a71323541c3751e334f17'),
//     userId: ObjectId('690a0aa884db5cd908530bc6'),
//     rating: 4,
//     comment: 'Perfect place for a family dinner. Kids loved it! The portions are generous and the service was outstanding. The waiter even brought crayons for the kids. Highly recommend!',
//     visitedAt: ISODate('2025-11-04T21:37:27.894Z'),
//     ownerReplyDate: ISODate('2025-11-04T21:37:27.894Z'),
//     createdAt: ISODate('2025-11-04T21:37:27.895Z'),
//     updatedAt: ISODate('2025-11-04T21:37:27.895Z'),
//     __v: 0
//   },
//   {
//     _id: ObjectId('690fbd5cb96064ccc68b9d5c'),
//     pointOfSaleId: ObjectId('690a697ffae7250165fc967c'),
//     userId: ObjectId('690a0aa884db5cd908530bc6'),
//     rating: 4,
//     comment: 'Perfect place for a family dinner. Kids loved it! The portions are generous and the service was outstanding. The waiter even brought crayons for the kids. Highly recommend!',
//     visitedAt: ISODate('2025-11-08T21:59:56.815Z'),
//     ownerReplyDate: ISODate('2025-11-08T21:59:56.815Z'),
//     createdAt: ISODate('2025-11-08T21:59:56.822Z'),
//     updatedAt: ISODate('2025-11-08T21:59:56.822Z'),
//     __v: 0
//   },
//   {
//     _id: ObjectId('690a5d1e8999c8138ddea75f'),
//     pointOfSaleId: '690a697ffae7250165fc967c',
//     userId: ObjectId('690a0aa884db5cd908530bc6'),
//     rating: 4,
//     comment: 'Perfect place for a family dinner. Kids loved it! The portions are generous and the service was outstanding. The waiter even brought crayons for the kids. Highly recommend!',
//     visitedAt: ISODate('2025-11-04T20:07:58.753Z'),
//     ownerReplyDate: ISODate('2025-11-04T20:07:58.753Z'),
//     createdAt: ISODate('2025-11-04T20:07:58.763Z'),
//     updatedAt: ISODate('2025-11-04T22:45:59.613Z'),
//     __v: 0,
//     ownerReply: 'Glad to have you here'
//   },
//   {
//     _id: ObjectId('690a5439b347d907343b8d1f'),
//     pointOfSaleId: '690a697ffae7250165fc967c',
//     userId: ObjectId('690a0a2484db5cd908530bbe'),
//     rating: 4.4,
//     comment: 'Great atmosphere and friendly staff. The pasta was excellent, though I found the pizza slightly too salty for my taste. Still a solid experience overall!',
//     ownerReply: "Thank you for your kind words, Mike! We appreciate your feedback about the salt level. We'll definitely take that into consideration. We look forward to serving you again!",
//     visitedAt: ISODate('2025-11-04T19:30:01.739Z'),
//     ownerReplyDate: ISODate('2025-11-04T19:30:01.739Z'),
//     createdAt: ISODate('2025-11-04T19:30:01.739Z'),
//     updatedAt: ISODate('2025-11-04T19:30:01.739Z'),
//     __v: 0
//   },
//   {
//     _id: ObjectId('690a5468b347d907343b8d24'),
//     pointOfSaleId: '690a697ffae7250165fc967c',
//     userId: ObjectId('690a0a2484db5cd908530bbe'),
//     rating: 5,
//     comment: "Best burgers in town! The bacon cheeseburger is incredible - perfectly cooked, juicy, and loaded with flavor. The fries are crispy and well-seasoned. Can't wait to come back!",
//     visitedAt: ISODate('2025-11-04T19:30:48.002Z'),
//     ownerReplyDate: ISODate('2025-11-04T19:30:48.002Z'),
//     createdAt: ISODate('2025-11-04T19:30:48.003Z'),
//     updatedAt: ISODate('2025-11-05T00:45:41.053Z'),
//     __v: 0,
//     ownerReply: 'It will be a pleasure to have you here in the futur!'
//   }
// ]
// Atlas atlas-oam500-shard-0 [primary] ecbi> db.reviews.f














