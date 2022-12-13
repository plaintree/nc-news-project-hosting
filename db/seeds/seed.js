const format = require("pg-format");
const db = require("../connection");
const {
  convertTimestampToDate,
  createRef,
  formatComments,
} = require("./utils");

const seed = async ({ topicData, userData, articleData, commentData }) => {
  await db.query(`DROP TABLE IF EXISTS comments;`);
  await db.query(`DROP TABLE IF EXISTS articles;`);
  await db.query(`DROP TABLE IF EXISTS users;`);
  await db.query(`DROP TABLE IF EXISTS topics;`);

  const topicsTablePromise = db.query(`
  CREATE TABLE topics (
    slug VARCHAR PRIMARY KEY,
    description VARCHAR
  );`);

  const usersTablePromise = db.query(`
  CREATE TABLE users (
    username VARCHAR PRIMARY KEY,
    name VARCHAR NOT NULL,
    avatar_url VARCHAR
  );`);

  await Promise.all([topicsTablePromise, usersTablePromise]);

  await db.query(`
  CREATE TABLE articles (
    article_id SERIAL PRIMARY KEY,
    title VARCHAR NOT NULL,
    topic VARCHAR NOT NULL REFERENCES topics(slug),
    author VARCHAR NOT NULL REFERENCES users(username),
    body VARCHAR NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    votes INT DEFAULT 0 NOT NULL
  );`);

  await db.query(`
  CREATE TABLE comments (
    comment_id SERIAL PRIMARY KEY,
    body VARCHAR NOT NULL,
    article_id INT REFERENCES articles(article_id) NOT NULL,
    author VARCHAR REFERENCES users(username) NOT NULL,
    votes INT DEFAULT 0 NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
  );`);

  const insertTopicsQueryStr = format(
    "INSERT INTO topics (slug, description) VALUES %L RETURNING *;",
    topicData.map(({ slug, description }) => [slug, description])
  );
  const topicsPromise = db
    .query(insertTopicsQueryStr)
    .then((result) => result.rows);

  const insertUsersQueryStr = format(
    "INSERT INTO users ( username, name, avatar_url) VALUES %L RETURNING *;",
    userData.map(({ username, name, avatar_url }) => [
      username,
      name,
      avatar_url,
    ])
  );
  const usersPromise = db
    .query(insertUsersQueryStr)
    .then((result) => result.rows);

  await Promise.all([topicsPromise, usersPromise]);

  const formattedArticleData = articleData.map(convertTimestampToDate);
  const insertArticlesQueryStr = format(
    "INSERT INTO articles (title, topic, author, body, created_at, votes) VALUES %L RETURNING *;",
    formattedArticleData.map(
      ({ title, topic, author, body, created_at, votes = 0 }) => [
        title,
        topic,
        author,
        body,
        created_at,
        votes,
      ]
    )
  );

  const articleRows = await db
    .query(insertArticlesQueryStr)
    .then((result) => result.rows);

  const articleIdLookup = createRef(articleRows, "title", "article_id");
  const formattedCommentData = formatComments(commentData, articleIdLookup);

  const insertCommentsQueryStr = format(
    "INSERT INTO comments (body, author, article_id, votes, created_at) VALUES %L RETURNING *;",
    formattedCommentData.map(
      ({ body, author, article_id, votes = 0, created_at }) => [
        body,
        author,
        article_id,
        votes,
        created_at,
      ]
    )
  );
  return db.query(insertCommentsQueryStr).then((result) => {
    return result.rows;
  });
};

module.exports = seed;

/*
[
  {
    comment_id: 1,
    body: 'Itaque quisquam est similique et est perspiciatis reprehenderit voluptatem autem. Voluptatem accusantium eius error adipisci quibusdam doloribus.',
    article_id: 18,
    author: 'tickle122',
    votes: -1,
    created_at: 2020-05-21T22:19:00.000Z
  },
  {
    comment_id: 2,
    body: 'Nobis consequatur animi. Ullam nobis quaerat voluptates veniam.',
    article_id: 4,
    author: 'grumpy19',
    votes: 7,
    created_at: 2020-01-01T15:02:00.000Z
  },
  {
    comment_id: 3,
    body: 'Qui sunt sit voluptas repellendus sed. Voluptatem et repellat fugiat. Rerum doloribus eveniet quidem vero aut sint officiis. Dolor facere et et architecto vero qui et perferendis dolorem. Magni quis ratione adipisci error assumenda ut. Id rerum eos facere sit nihil ipsam officia aspernatur odio.',
    article_id: 3,
    author: 'grumpy19',
    votes: 3,
    created_at: 2020-09-22T23:18:00.000Z
  },
  {
    comment_id: 4,
    body: 'Rerum voluptatem quam odio facilis quis illo unde. Ex blanditiis optio tenetur sunt. Cumque dolor ducimus et qui officia quasi non illum reiciendis.',
    article_id: 18,
    author: 'happyamy2016',
    votes: 4,
    created_at: 2020-10-10T22:03:00.000Z
  },
  {
    comment_id: 5,
    body: 'Quod qui quia dignissimos sit tempore vel reprehenderit. Ipsa ipsa veritatis architecto corporis et et non. Sed alias occaecati eum dignissimos sint eius. Ad ea iste quas quia velit libero voluptatem voluptatem. Animi illo nisi nulla quia sapiente omnis dolorem nulla. Sunt dolor similique.',
    article_id: 17,
    author: 'weegembump',
    votes: -5,
    created_at: 2020-04-03T20:17:00.000Z
  },
  {
    comment_id: 6,
    body: 'Veritatis animi et voluptates nesciunt officia facere eaque. Eligendi earum explicabo necessitatibus aut dolorem nisi esse nesciunt. Non iusto rem ut consequuntur quam ut rem sed. Velit laboriosam consectetur enim delectus eos sit veritatis eveniet perspiciatis.',
    article_id: 35,
    author: 'grumpy19',
    votes: -5,
    created_at: 2020-07-16T08:16:00.000Z
  },
  {
    comment_id: 7,
    body: 'Facilis corporis animi et non non minus nisi. Magnam et sequi dolorum fugiat ab assumenda.',
    article_id: 17,
    author: 'tickle122',
    votes: 12,
    created_at: 2020-04-08T22:10:00.000Z
  },
  {
    comment_id: 8,
    body: 'Est debitis iusto sed consectetur. Eum eum rerum qui est nihil maxime quae. Ut autem velit sint iste consequatur culpa voluptatibus. Quo qui nobis cupiditate adipisci nostrum et. Est et qui at sit atque et fuga voluptatibus impedit.',
    article_id: 26,
    author: 'tickle122',
    votes: 6,
    created_at: 2020-11-21T19:16:00.000Z
  },
  {
    comment_id: 9,
    body: 'Ea iure voluptas. Esse vero et dignissimos blanditiis commodi rerum dicta omnis modi.',
    article_id: 19,
    author: 'cooljmessy',
    votes: -1,
    created_at: 2020-01-04T05:14:00.000Z
  },
  {
    comment_id: 10,
    body: 'Incidunt quidem ut. Voluptatem blanditiis ipsa commodi suscipit quae et. Magni assumenda veritatis voluptatem dolor qui.',
    article_id: 27,
    author: 'weegembump',
    votes: 7,
    created_at: 2020-11-24T08:26:00.000Z
  },
  {
    comment_id: 11,
    body: 'Iure cum non veritatis dolore corrupti deserunt perferendis molestiae. Voluptatem ullam qui aut voluptatem. Magnam quo ut rem nobis quibusdam. Assumenda ex laboriosam ut ea explicabo.',
    article_id: 23,
    author: 'happyamy2016',
    votes: 2,
    created_at: 2020-11-11T18:16:00.000Z
  },
  {
    comment_id: 12,
    body: 'Maiores sed dolor. Consequatur quasi itaque culpa. Tempora ut autem est ad est voluptatem officiis. Ut sequi quaerat qui nam sunt.',
    article_id: 11,
    author: 'happyamy2016',
    votes: 15,
    created_at: 2020-06-19T05:00:00.000Z
  },
  {
    comment_id: 13,
    body: 'Dolorem ex dolorem blanditiis id. Error dolorem aut est. Facere nostrum et dolor repellendus neque amet deleniti. Aut debitis ut nam dolores.',
    article_id: 16,
    author: 'happyamy2016',
    votes: 4,
    created_at: 2020-09-10T01:18:00.000Z
  },
  {
    comment_id: 14,
    body: 'Iure quas est omnis porro. Est in est distinctio sequi consectetur rerum deserunt. Et et reiciendis. Consequatur distinctio sint porro neque molestiae.',
    article_id: 4,
    author: 'weegembump',
    votes: -4,
    created_at: 2020-08-14T13:09:00.000Z
  },
  {
    comment_id: 15,
    body: 'Voluptas enim dolores minima repellendus corporis mollitia omnis. Consectetur vitae quaerat possimus repellendus. Cumque maxime nisi itaque aliquid vel non non.',
    article_id: 13,
    author: 'jessjelly',
    votes: 12,
    created_at: 2020-01-03T13:22:00.000Z
  },
  {
    comment_id: 16,
    body: 'Saepe iure voluptas aut cum occaecati illo. Unde neque et qui facilis cupiditate animi distinctio.',
    article_id: 30,
    author: 'happyamy2016',
    votes: 1,
    created_at: 2020-04-03T22:01:00.000Z
  },
  {
    comment_id: 17,
    body: 'Aut rerum culpa consequuntur quos ut pariatur beatae et. Est reprehenderit commodi quia molestiae laboriosam tenetur maxime voluptate et. Sapiente alias illum eaque libero.',
    article_id: 17,
    author: 'weegembump',
    votes: 2,
    created_at: 2020-07-10T08:00:00.000Z
  },
  {
    comment_id: 18,
    body: 'Dicta aut quo unde cupiditate dolorum. Voluptas mollitia exercitationem vel porro dolor. Ea autem est pariatur.',
    article_id: 5,
    author: 'jessjelly',
    votes: 6,
    created_at: 2020-08-15T17:11:00.000Z
  },
  {
    comment_id: 19,
    body: 'Id adipisci saepe dolorum et veritatis qui et voluptatibus. Error consequuntur architecto consequatur assumenda rerum similique quo. Quas omnis quam labore exercitationem pariatur veniam assumenda. Tempore maiores rerum. Eum voluptates non repudiandae magnam illo voluptatum. Qui praesentium asperiores rerum vel.',
    article_id: 28,
    author: 'tickle122',
    votes: -3,
    created_at: 2020-06-19T15:03:00.000Z
  },
  {
    comment_id: 20,
    body: 'Libero explicabo aperiam esse quae. Dolores in ipsum vitae incidunt. Magnam ullam nihil voluptas enim veritatis et nobis architecto.',
    article_id: 13,
    author: 'happyamy2016',
    votes: 0,
    created_at: 2020-04-07T04:19:00.000Z
  },
  {
    comment_id: 21,
    body: 'Exercitationem voluptas inventore corrupti in tenetur cumque. Ut officiis aliquam et quis. Ipsum nostrum sequi voluptatem ex.',
    article_id: 6,
    author: 'tickle122',
    votes: 3,
    created_at: 2020-02-05T12:15:00.000Z
  },
  {
    comment_id: 22,
    body: 'Voluptatibus tempora ab quam pariatur placeat ullam voluptatem aut. Sequi voluptatem vitae quibusdam et qui est quia. Explicabo delectus ullam quis. Officiis eum ipsam non voluptate quam dolores consequatur. Odio aliquam ut eum tempore enim nesciunt.',
    article_id: 27,
    author: 'cooljmessy',
    votes: 2,
    created_at: 2020-06-09T18:02:00.000Z
  },
  {
    comment_id: 23,
    body: 'Necessitatibus ea eum error ratione sint cumque occaecati non. Dolor rem accusantium sed debitis. Dolor tempora molestias cupiditate veritatis sit sit ipsam. Aut neque et dolore laboriosam.',
    article_id: 10,
    author: 'cooljmessy',
    votes: 2,
    created_at: 2020-02-08T05:12:00.000Z
  },
  {
    comment_id: 24,
    body: 'Quisquam perferendis est doloribus quidem a a. Quam quia ratione rerum facilis rerum est quo aut. Doloribus odio non aut tenetur et qui. Maiores vitae qui illo nisi illum. Accusamus consequatur ducimus vero non nobis alias ratione et aut.',
    article_id: 31,
    author: 'weegembump',
    votes: 16,
    created_at: 2020-01-08T11:14:00.000Z
  },
  {
    comment_id: 25,
    body: 'Ea et molestiae error. Esse harum facilis vitae numquam. Minus id eaque. Dolores nulla ipsam animi sapiente perspiciatis qui possimus.',
    article_id: 20,
    author: 'grumpy19',
    votes: 20,
    created_at: 2020-08-20T06:19:00.000Z
  },
  {
    comment_id: 26,
    body: 'Aut iste eum et modi unde. Sunt et adipisci et ut dolorem facilis voluptas. Deleniti sed nemo facilis. Ex ut et. Et pariatur sed necessitatibus et. Accusamus accusantium ipsam ea sunt facilis et.',
    article_id: 16,
    author: 'grumpy19',
    votes: 3,
    created_at: 2020-08-14T01:21:00.000Z
  },
  {
    comment_id: 27,
    body: 'Dolorem aspernatur labore reiciendis. Similique consequuntur voluptatem illum voluptate illo voluptas et nihil rem. Deserunt et totam tenetur quod. Maxime atque dolorem velit ut sit assumenda. Suscipit tenetur nemo ut ea eos et molestiae quisquam. Architecto asperiores esse.',
    article_id: 31,
    author: 'happyamy2016',
    votes: 12,
    created_at: 2020-05-19T00:14:00.000Z
  },
  {
    comment_id: 28,
    body: 'Dolorem excepturi quaerat. Earum dolor sapiente aut.',
    article_id: 3,
    author: 'grumpy19',
    votes: 2,
    created_at: 2020-03-04T13:05:00.000Z
  },
  {
    comment_id: 29,
    body: 'Perferendis quia et nihil. Quasi ut voluptates sapiente et accusantium vel qui reprehenderit ratione. Autem alias voluptatem accusamus nesciunt beatae vero. Itaque repellat omnis et velit cum corporis aut id voluptas. Nostrum unde fuga ea. Perferendis quas maiores.',
    article_id: 36,
    author: 'jessjelly',
    votes: -2,
    created_at: 2020-09-13T06:23:00.000Z
  },
  {
    comment_id: 30,
    body: 'Et et esse magni qui minus quia adipisci dignissimos. Rerum ab sit voluptatum sequi aspernatur et.',
    article_id: 15,
    author: 'jessjelly',
    votes: 14,
    created_at: 2020-08-25T22:10:00.000Z
  },
  {
    comment_id: 31,
    body: 'Sit sequi odio suscipit. Iure quisquam qui alias distinctio eos officia enim aut sit. Corrupti ut praesentium ut iste earum itaque qui. Dolores in ab rerum consequuntur. Id ab aliquid autem dolore.',
    article_id: 1,
    author: 'weegembump',
    votes: 11,
    created_at: 2020-09-26T16:16:00.000Z
  },
  {
    comment_id: 32,
    body: 'Occaecati distinctio et maiores atque. Rerum aut vel iste beatae mollitia commodi. Cumque quia illum. Hic rerum sed.',
    article_id: 26,
    author: 'happyamy2016',
    votes: 16,
    created_at: 2020-01-02T14:18:00.000Z
  },
  {
    comment_id: 33,
    body: 'Explicabo perspiciatis voluptatem sunt tenetur maxime aut. Optio totam modi. Perspiciatis et quia.',
    article_id: 1,
    author: 'cooljmessy',
    votes: 4,
    created_at: 2019-12-31T21:21:00.000Z
  },
  {
    comment_id: 34,
    body: 'Omnis dolores sit. Suscipit dolore quia quia quia qui sunt error. Velit dolores eum cupiditate officiis minima quaerat. Fugiat occaecati magnam distinctio. Ut quia maxime adipisci dolorem qui nesciunt et voluptas.',
    article_id: 27,
    author: 'jessjelly',
    votes: 13,
    created_at: 2020-11-08T21:14:00.000Z
  },
  {
    comment_id: 35,
    body: 'Accusamus error recusandae iure. Omnis ab aut id. Nihil perspiciatis aut unde recusandae voluptatum placeat.',
    article_id: 19,
    author: 'happyamy2016',
    votes: -2,
    created_at: 2020-06-07T07:10:00.000Z
  },
  {
    comment_id: 36,
    body: 'Debitis exercitationem numquam unde quo illo. Iste rerum rerum non accusantium voluptatibus adipisci expedita expedita adipisci. Minima quae velit et ea eveniet. Vero quis itaque. Aliquid facilis dolores consequatur ea amet magni aliquid.',
    article_id: 28,
    author: 'jessjelly',
    votes: 17,
    created_at: 2020-05-26T18:06:00.000Z
  },
  {
    comment_id: 37,
    body: 'Ut odit ad repudiandae laudantium facilis pariatur aliquid. Pariatur quidem voluptatibus recusandae in consequatur beatae sint. Aut error ratione culpa ipsam autem saepe vel sit enim. Adipisci voluptas sit sed perferendis ipsum molestiae. Sit perferendis veritatis illo et facilis eos libero error. Repellendus ea dolores deserunt inventore.',
    article_id: 23,
    author: 'tickle122',
    votes: 12,
    created_at: 2020-09-18T14:13:00.000Z
  },
  {
    comment_id: 38,
    body: 'Ipsam quod dolor harum alias porro dignissimos vero et. Quia accusantium qui ratione eius qui.',
    article_id: 8,
    author: 'jessjelly',
    votes: 7,
    created_at: 2020-06-16T06:07:00.000Z
  },
  {
    comment_id: 39,
    body: 'Et veniam blanditiis fuga rem rem officiis debitis rerum. Est repudiandae tempora autem harum omnis et. Et consectetur sed assumenda asperiores amet quo eaque.',
    article_id: 31,
    author: 'grumpy19',
    votes: 16,
    created_at: 2020-07-21T00:04:00.000Z
  },
  {
    comment_id: 40,
    body: 'Et optio voluptatem sed reprehenderit quibusdam. Reprehenderit doloremque laboriosam. Vel est amet quia dolor rerum consequatur. Distinctio tenetur dolores. Voluptates laboriosam repudiandae et quisquam ex. Dolorem quidem et.',
    article_id: 7,
    author: 'tickle122',
    votes: 5,
    created_at: 2020-02-19T05:15:00.000Z
  },
  {
    comment_id: 41,
    body: 'Incidunt temporibus ipsam fuga voluptatem occaecati vel corporis. Consectetur laudantium tenetur ratione cumque. Molestiae esse non minima beatae id consequuntur voluptas optio. Pariatur nesciunt sed eum architecto a nemo dignissimos dignissimos. Dolores dicta eum voluptatem ea quas soluta sunt mollitia optio.',
    article_id: 29,
    author: 'happyamy2016',
    votes: 1,
    created_at: 2020-10-19T02:15:00.000Z
  },
  {
    comment_id: 42,
    body: 'Harum odit sed doloremque eos voluptates vero ipsa odio eos. Velit et voluptatum accusantium. Eligendi deserunt sunt optio est hic nisi reprehenderit. Quasi et delectus facere modi.',
    article_id: 31,
    author: 'jessjelly',
    votes: 16,
    created_at: 2020-02-12T08:26:00.000Z
  },
  {
    comment_id: 43,
    body: 'Ipsam quis ad consequatur iure voluptas accusantium voluptatem unde. Cumque omnis mollitia natus nemo deleniti rerum enim cumque aut. Quod quis est fuga.',
    article_id: 8,
    author: 'grumpy19',
    votes: -2,
    created_at: 2020-01-18T08:17:00.000Z
  },
  {
    comment_id: 44,
    body: 'Error est qui id corrupti et quod enim accusantium minus. Deleniti quae ea magni officiis et qui suscipit non.',
    article_id: 1,
    author: 'grumpy19',
    votes: 4,
    created_at: 2020-06-15T15:13:00.000Z
  },
  {
    comment_id: 45,
    body: 'Sint doloribus expedita non sed fuga aliquid vero. Amet consectetur eos eum. Tempora error velit rerum vitae voluptatem voluptatibus consequuntur voluptatibus ea. Et vitae et pariatur est molestias. Nobis est harum debitis rem accusantium est ipsa sed. Voluptatem beatae at beatae.',
    article_id: 9,
    author: 'cooljmessy',
    votes: 10,
    created_at: 2020-09-09T17:11:00.000Z
  },
  {
    comment_id: 46,
    body: 'Non sunt quos aut facere. Corporis molestiae aut soluta aut rerum animi voluptatibus.',
    article_id: 26,
    author: 'weegembump',
    votes: -3,
    created_at: 2020-10-05T06:05:00.000Z
  },
  {
    comment_id: 47,
    body: 'Ea quod sunt nihil mollitia qui laboriosam eaque quas accusantium. Eveniet exercitationem esse dolor autem repellat laborum voluptatibus alias repellendus. Magni nostrum ut ea molestiae. Et ut at quasi aut.',
    article_id: 10,
    author: 'happyamy2016',
    votes: 0,
    created_at: 2020-01-13T09:01:00.000Z
  },
  {
    comment_id: 48,
    body: 'Eaque fugiat est veniam ex praesentium et saepe molestias non. Est dolore et sint consequuntur.',
    article_id: 34,
    author: 'jessjelly',
    votes: 12,
    created_at: 2020-03-08T20:02:00.000Z
  },
  {
    comment_id: 49,
    body: 'Omnis dolor rerum culpa est ducimus totam voluptatibus id. Consequuntur vel cupiditate asperiores. Eos non molestiae accusamus esse excepturi animi vel animi.',
    article_id: 31,
    author: 'cooljmessy',
    votes: 13,
    created_at: 2020-11-05T18:26:00.000Z
  },
  {
    comment_id: 50,
    body: 'Et sed quia repudiandae aut error ut. Sequi voluptas error ut quibusdam officia quis. Sapiente est rem. Culpa molestiae omnis vel. Explicabo ea velit ipsa quasi autem error culpa quasi. Nulla ab omnis optio non voluptatem cumque.',
    article_id: 34,
    author: 'cooljmessy',
    votes: 0,
    created_at: 2020-03-22T11:15:00.000Z
  },
  {
    comment_id: 51,
    body: 'Eius dolor ipsa eaque qui sed accusantium est tenetur omnis. Eligendi necessitatibus sunt voluptate occaecati et quis consequuntur aut. Maxime nihil ut quia culpa.',
    article_id: 3,
    author: 'grumpy19',
    votes: -3,
    created_at: 2020-01-14T03:12:00.000Z
  },
  {
    comment_id: 52,
    body: 'Consectetur deleniti sed. Omnis et dolore omnis aspernatur. Et porro accusantium. Tempora ullam voluptatum et rerum.',
    article_id: 1,
    author: 'jessjelly',
    votes: 10,
    created_at: 2020-07-07T08:14:00.000Z
  },
  {
    comment_id: 53,
    body: 'Tempore itaque aperiam nostrum molestiae et veniam. Dolores dignissimos beatae quia quam impedit modi recusandae. Modi quaerat rerum itaque sint modi. Aperiam blanditiis officia qui odio veniam et. Sit accusantium ut.',
    article_id: 29,
    author: 'happyamy2016',
    votes: 10,
    created_at: 2020-02-05T15:13:00.000Z
  },
  {
    comment_id: 54,
    body: 'Possimus exercitationem unde temporibus id eos officiis. Qui veniam blanditiis porro omnis rerum. Vel iste nisi voluptatem autem illum aperiam velit.',
    article_id: 34,
    author: 'grumpy19',
    votes: 8,
    created_at: 2020-09-16T22:12:00.000Z
  },
  {
    comment_id: 55,
    body: 'Ut et libero reiciendis. Tenetur quibusdam veniam in atque corrupti excepturi tenetur qui et. Qui ut autem minus aut explicabo in cumque dolorum. Voluptatem est perferendis velit. Eaque doloremque asperiores error.',
    article_id: 6,
    author: 'jessjelly',
    votes: -3,
    created_at: 2020-01-16T23:20:00.000Z
  },
  {
    comment_id: 56,
    body: 'Ullam ad aliquam labore sint quia quo autem. Earum accusamus mollitia eum consectetur est doloremque corrupti aliquam. Soluta maxime rerum ipsum molestiae id temporibus tempore.',
    article_id: 10,
    author: 'weegembump',
    votes: 4,
    created_at: 2020-08-07T14:20:00.000Z
  },
  {
    comment_id: 57,
    body: 'Et aliquam consequatur ea sunt et. Maxime aut nobis voluptatem eos facilis vero incidunt delectus. Atque quaerat id aut tempore non hic hic sed. Nemo natus culpa nesciunt. Beatae quod est omnis hic aliquam accusantium dolorum natus. Totam voluptatem incidunt a repudiandae ut.',
    article_id: 34,
    author: 'happyamy2016',
    votes: 5,
    created_at: 2020-04-22T17:05:00.000Z
  },
  {
    comment_id: 58,
    body: 'Dicta et doloremque rerum quod dolorem mollitia exercitationem quia. Quas quis quam recusandae occaecati sit voluptas. Et ut voluptatibus est eos. Placeat consectetur non nisi dolores ea non unde sit aperiam.',
    article_id: 16,
    author: 'jessjelly',
    votes: 12,
    created_at: 2020-04-01T10:07:00.000Z
  },
  {
    comment_id: 59,
    body: 'Incidunt maiores exercitationem. Non illo non recusandae omnis praesentium architecto. Molestiae vero quia occaecati. Et sed magni blanditiis quis quia consequatur dolores nulla nisi. A omnis velit voluptatem.',
    article_id: 32,
    author: 'cooljmessy',
    votes: 6,
    created_at: 2020-11-14T01:07:00.000Z
  },
  {
    comment_id: 60,
    body: 'Aut optio perferendis praesentium fugiat. Vel similique non eveniet. Repellat molestiae ipsum voluptates.',
    article_id: 7,
    author: 'tickle122',
    votes: 19,
    created_at: 2020-10-07T03:19:00.000Z
  },
  {
    comment_id: 61,
    body: 'Quos deserunt ut doloremque animi. Error ipsum assumenda aliquam tempore est et suscipit eveniet necessitatibus. Sequi illo dolor quia incidunt voluptates sint dolore. Aut impedit dolores.',
    article_id: 31,
    author: 'cooljmessy',
    votes: 13,
    created_at: 2020-03-07T16:04:00.000Z
  },
  {
    comment_id: 62,
    body: 'Nesciunt pariatur autem dolor. Quas et nostrum occaecati qui dolores. Et cumque nostrum aut. Aut doloribus aut modi repellendus maiores quia laudantium doloremque. Qui vitae laudantium sunt ut iusto. Et aut ipsam iste.',
    article_id: 19,
    author: 'grumpy19',
    votes: 1,
    created_at: 2020-01-06T02:15:00.000Z
  },
  {
    comment_id: 63,
    body: 'Est pariatur quis ipsa culpa unde temporibus et accusantium rerum. Consequatur in occaecati aut non similique aut quibusdam. Qui sunt magnam iure blanditiis. Et est non enim. Est ab vero dolor.',
    article_id: 2,
    author: 'jessjelly',
    votes: -1,
    created_at: 2020-08-12T22:10:00.000Z
  },
  {
    comment_id: 64,
    body: 'Ad qui ut enim qui numquam quis. Reprehenderit rem non nulla dolor aut totam corporis illo. Et ea maxime consequuntur nihil delectus dolores qui in aliquam. Ut et eius id nesciunt necessitatibus beatae quo. Est qui provident officia in dolor. Assumenda voluptas dolor.',
    article_id: 6,
    author: 'grumpy19',
    votes: -5,
    created_at: 2020-09-23T08:15:00.000Z
  },
  {
    comment_id: 65,
    body: 'Officia nihil harum saepe occaecati dolores inventore. Eos cum illo aut blanditiis eum.',
    article_id: 6,
    author: 'weegembump',
    votes: 4,
    created_at: 2020-10-18T23:05:00.000Z
  },
  {
    comment_id: 66,
    body: 'Aperiam similique recusandae et rerum aut unde sed. Fuga voluptatem illum aut impedit excepturi. Et quaerat minima in veniam in maxime nam quia. Fugit nostrum ipsa ipsa est sunt quidem nostrum sit pariatur. Voluptas aspernatur ex.',
    article_id: 27,
    author: 'weegembump',
    votes: 15,
    created_at: 2020-01-06T17:03:00.000Z
  },
  {
    comment_id: 67,
    body: 'Sapiente ut debitis qui sit autem dolores. Quis et consequatur eligendi dolorum quia quam odit qui. Quaerat ut sit fugit ut sint et sequi est.',
    article_id: 27,
    author: 'jessjelly',
    votes: 9,
    created_at: 2020-06-30T08:24:00.000Z
  },
  {
    comment_id: 68,
    body: 'Voluptatibus harum illo occaecati itaque inventore. Alias dolores consequatur fugit id rerum repellat. Qui molestiae dolore quia.',
    article_id: 20,
    author: 'cooljmessy',
    votes: 8,
    created_at: 2020-09-21T11:03:00.000Z
  },
  {
    comment_id: 69,
    body: 'Totam et dolor magnam et voluptatum. A in adipisci.',
    article_id: 23,
    author: 'tickle122',
    votes: -1,
    created_at: 2020-08-14T12:08:00.000Z
  },
  {
    comment_id: 70,
    body: 'Et ullam nihil repudiandae facere sunt cupiditate cum. Doloremque voluptatem rerum qui error omnis. Dolorum numquam dolorum voluptas ad.',
    article_id: 4,
    author: 'grumpy19',
    votes: 2,
    created_at: 2020-03-05T06:04:00.000Z
  },
  {
    comment_id: 71,
    body: 'Recusandae dolorem consequatur non a accusantium ea. Ut repudiandae doloremque expedita perspiciatis voluptas. Optio adipisci consequuntur. Reprehenderit veritatis eos voluptatem sed alias voluptatem atque. Eos repudiandae enim quos tenetur eos deserunt perspiciatis aut velit.',
    article_id: 30,
    author: 'cooljmessy',
    votes: 7,
    created_at: 2020-06-10T09:04:00.000Z
  },
  {
    comment_id: 72,
    body: 'Cumque qui eius consequatur pariatur reprehenderit at rem nobis. Consequatur id qui iste voluptatem iste esse eligendi. Et sint porro alias architecto dolores.',
    article_id: 31,
    author: 'jessjelly',
    votes: 5,
    created_at: 2020-04-15T00:21:00.000Z
  },
  {
    comment_id: 73,
    body: 'Fugiat molestiae iure et qui consequatur expedita quia. Est sed repellat nesciunt nulla sit in dolor laudantium. Totam vero et quam. In numquam magnam voluptas itaque. Quisquam vel vitae doloribus vel id laboriosam quibusdam.',
    article_id: 4,
    author: 'grumpy19',
    votes: 16,
    created_at: 2020-01-24T07:01:00.000Z
  },
  {
    comment_id: 74,
    body: 'Eius dolor qui ut eligendi. Vero et animi consequatur placeat repudiandae ex dolores qui magni. Omnis magnam rerum molestiae. Nihil rerum ipsa error quibusdam. Qui temporibus quia quia. Natus necessitatibus numquam deserunt quisquam distinctio soluta consequatur.',
    article_id: 6,
    author: 'cooljmessy',
    votes: 3,
    created_at: 2020-11-04T21:21:00.000Z
  },
  {
    comment_id: 75,
    body: 'Quis iure rerum adipisci a porro ratione. Consequatur sequi ipsam esse ut ratione laudantium odio blanditiis fuga. Reprehenderit excepturi nihil beatae aut voluptate aliquid culpa animi.',
    article_id: 35,
    author: 'jessjelly',
    votes: 2,
    created_at: 2020-06-06T20:16:00.000Z
  },
  {
    comment_id: 76,
    body: 'Expedita praesentium porro doloremque doloribus consequuntur dolorum. Consequatur asperiores veritatis et debitis autem et vel fugit. Earum placeat nemo sit.',
    article_id: 10,
    author: 'grumpy19',
    votes: 0,
    created_at: 2020-05-10T20:11:00.000Z
  },
  {
    comment_id: 77,
    body: 'Hic qui omnis qui sit deserunt velit labore commodi repellat. Minus voluptatum dolore libero voluptatem praesentium aut iusto harum. Consequatur sit quasi. Est ad minus inventore ut reiciendis. Quos incidunt rerum. Ut omnis in voluptatum nesciunt.',
    article_id: 8,
    author: 'tickle122',
    votes: -2,
    created_at: 2020-11-06T19:20:00.000Z
  },
  {
    comment_id: 78,
    body: 'Ab distinctio rerum enim ut illum. Vel deleniti placeat error eligendi. Sapiente provident hic rerum. Nihil nostrum corporis.',
    article_id: 35,
    author: 'happyamy2016',
    votes: 7,
    created_at: 2020-09-11T16:02:00.000Z
  },
  {
    comment_id: 79,
    body: 'Possimus adipisci et cupiditate rerum dolores provident. Vero est autem. Voluptatum nemo officia dolorem et a ipsa. Laboriosam doloremque aperiam.',
    article_id: 20,
    author: 'grumpy19',
    votes: 7,
    created_at: 2020-11-19T10:05:00.000Z
  },
  {
    comment_id: 80,
    body: 'Voluptatem voluptas unde. Quam tempore recusandae voluptatem similique iusto repudiandae et. Tenetur dolores possimus labore. Incidunt quae ipsa qui quas. Sunt suscipit aliquid vitae.',
    article_id: 31,
    author: 'cooljmessy',
    votes: -5,
    created_at: 2020-07-14T02:02:00.000Z
  },
  {
    comment_id: 81,
    body: 'Incidunt perferendis et eum. Odit aut eaque. Repudiandae et quia impedit quisquam dolore fugit. Magnam non magni qui molestias dolore sed facere blanditiis. Qui doloribus autem dolorum dolor aliquam. Tempora cum officia tempore.',
    article_id: 7,
    author: 'weegembump',
    votes: 12,
    created_at: 2020-07-25T23:10:00.000Z
  },
  {
    comment_id: 82,
    body: 'Facilis ipsam illum aut voluptatibus. Repudiandae cupiditate quo fugiat earum est ut autem repudiandae excepturi. Fuga voluptatem iusto ut. Nulla sequi culpa qui eaque. Architecto non veniam distinctio.',
    article_id: 11,
    author: 'happyamy2016',
    votes: -4,
    created_at: 2020-08-19T07:08:00.000Z
  },
  {
    comment_id: 83,
    body: 'Velit in assumenda quo repudiandae qui eaque. Qui dolor ad iusto optio magnam suscipit.',
    article_id: 24,
    author: 'weegembump',
    votes: -2,
    created_at: 2020-04-08T21:01:00.000Z
  },
  {
    comment_id: 84,
    body: 'Modi cum quo maxime sunt quia doloribus consequatur recusandae. Quam temporibus est non dolorem. Rerum dolorem nulla sed nam repellendus doloribus non accusantium. Id beatae est et a.',
    article_id: 13,
    author: 'grumpy19',
    votes: 0,
    created_at: 2020-10-11T05:19:00.000Z
  },
  {
    comment_id: 85,
    body: 'Assumenda sit est blanditiis asperiores est minima. Placeat sequi tenetur autem consequatur soluta molestiae. Incidunt neque labore et dolorem et vel possimus nemo quidem.',
    article_id: 1,
    author: 'happyamy2016',
    votes: 0,
    created_at: 2020-08-23T01:14:00.000Z
  },
  {
    comment_id: 86,
    body: 'Et explicabo dignissimos officia dolore rerum aliquam corrupti. Culpa corporis earum et earum officia a est atque at. Quidem quo recusandae delectus autem possimus blanditiis optio. Sed culpa culpa. Exercitationem nemo aspernatur alias ut qui.',
    article_id: 1,
    author: 'tickle122',
    votes: 14,
    created_at: 2020-10-04T01:03:00.000Z
  },
  {
    comment_id: 87,
    body: 'Explicabo cumque sequi aut. Sed minus et aut consequatur. Iste qui temporibus non corporis non. Laudantium tenetur quaerat repellendus. Neque ut qui sunt. Eaque sit fugit est ad molestiae.',
    article_id: 26,
    author: 'grumpy19',
    votes: 6,
    created_at: 2020-03-09T18:19:00.000Z
  },
  {
    comment_id: 88,
    body: 'Minus minus sit non fugiat sunt et nostrum aut et. Dignissimos qui nemo quos fuga qui temporibus occaecati aut. Explicabo dolor commodi officia nulla totam inventore.',
    article_id: 5,
    author: 'weegembump',
    votes: -3,
    created_at: 2020-05-26T15:11:00.000Z
  },
  {
    comment_id: 89,
    body: 'Esse et expedita harum non. Voluptatibus commodi voluptatem. Minima velit suscipit numquam ea. Id vitae debitis aut incidunt odio quo quam possimus ipsum.',
    article_id: 1,
    author: 'cooljmessy',
    votes: 2,
    created_at: 2020-10-24T06:08:00.000Z
  },
  {
    comment_id: 90,
    body: 'Maxime error necessitatibus voluptatibus labore aliquid. Animi a maiores quo aut quia libero repellendus aut delectus. Illo dolorem sit eos at molestias sed. Sint quibusdam harum eos quidem praesentium corporis. Ut dolor aut consectetur nisi deserunt.',
    article_id: 36,
    author: 'jessjelly',
    votes: 2,
    created_at: 2020-01-16T00:00:00.000Z
  },
  {
    comment_id: 91,
    body: 'Quo aut ut quaerat quia laudantium nemo. Et est non sed dolor cupiditate voluptatem quia et officia.',
    article_id: 26,
    author: 'happyamy2016',
    votes: 5,
    created_at: 2020-05-17T04:18:00.000Z
  },
  {
    comment_id: 92,
    body: 'Aut doloremque explicabo id. Deleniti libero in dolore sit ea voluptatem ipsa.',
    article_id: 9,
    author: 'cooljmessy',
    votes: 0,
    created_at: 2020-06-03T00:02:00.000Z
  },
  {
    comment_id: 93,
    body: 'Impedit impedit similique quaerat sit. Fugit et aliquid quae doloremque dolores amet velit. Quia cupiditate ipsa ad aliquid minus voluptatem eaque.',
    article_id: 36,
    author: 'cooljmessy',
    votes: 0,
    created_at: 2020-04-25T11:25:00.000Z
  },
  {
    comment_id: 94,
    body: 'Voluptatum aut facilis odit sint. Iste ab ut mollitia aut odio. Similique aut a ut est impedit. Similique dolorum possimus ipsum voluptatem iste non commodi placeat quia. Vero aperiam eum voluptatem aut sed totam dicta suscipit.',
    article_id: 29,
    author: 'weegembump',
    votes: -4,
    created_at: 2020-04-15T06:17:00.000Z
  },
  {
    comment_id: 95,
    body: 'Praesentium pariatur a nisi. Minima eius est saepe aut.',
    article_id: 21,
    author: 'grumpy19',
    votes: 11,
    created_at: 2020-01-22T17:04:00.000Z
  },
  {
    comment_id: 96,
    body: 'Eos exercitationem dolorem autem autem nesciunt voluptas molestiae quas. Ut id qui. Quis quia consequatur veritatis magnam autem. Corrupti corporis illo in in est aperiam.',
    article_id: 23,
    author: 'weegembump',
    votes: 11,
    created_at: 2020-09-07T08:22:00.000Z
  },
  {
    comment_id: 97,
    body: 'Enim sunt nam rerum quidem. Quod quia aliquam numquam et laboriosam doloribus iusto et. Numquam quae quis hic maiores. Sed quos et dolore esse cumque consequatur blanditiis placeat omnis. Omnis qui magni explicabo.',
    article_id: 35,
    author: 'weegembump',
    votes: 19,
    created_at: 2020-02-20T07:13:00.000Z
  },
  {
    comment_id: 98,
    body: 'Delectus nostrum autem. Dolore est id veniam maxime aliquid omnis nam cupiditate consequatur. Eveniet similique et voluptatem voluptatem illo. Quam officiis aut molestias hic est omnis. Dolor enim dolores. Quo explicabo reprehenderit reprehenderit nostrum magni in.',
    article_id: 17,
    author: 'grumpy19',
    votes: -3,
    created_at: 2020-02-07T02:23:00.000Z
  },
  {
    comment_id: 99,
    body: 'Reiciendis enim soluta a sed cumque dolor quia quod sint. Laborum tempore est et quisquam dolore. Qui voluptas consequatur cumque neque et laborum unde sed. Impedit et consequatur tempore dignissimos earum distinctio cupiditate.',
    article_id: 19,
    author: 'happyamy2016',
    votes: 17,
    created_at: 2020-09-18T18:05:00.000Z
  },
  {
    comment_id: 100,
    body: 'Corporis magnam placeat quia nulla illum nisi. Provident magni aut et earum illo labore aperiam. Dolorem ipsum dignissimos est ex. Minima voluptatibus nihil commodi veritatis. Magnam aut suscipit dignissimos nostrum ea.',
    article_id: 29,
    author: 'weegembump',
    votes: 3,
    created_at: 2020-06-18T12:10:00.000Z
  },
*/
