const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Book = require('./models/Book');

const books = [
  // Fiction
  { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', isbn: '978-0743273565', category: 'Fiction', description: 'A story of the fabulously wealthy Jay Gatsby.', totalCopies: 3, availableCopies: 3, publisher: 'Scribner', publishedYear: 1925 },
  { title: 'To Kill a Mockingbird', author: 'Harper Lee', isbn: '978-0061935466', category: 'Fiction', description: 'A classic of modern American literature.', totalCopies: 4, availableCopies: 4, publisher: 'HarperCollins', publishedYear: 1960 },
  { title: '1984', author: 'George Orwell', isbn: '978-0451524935', category: 'Fiction', description: 'A dystopian social science fiction novel.', totalCopies: 5, availableCopies: 5, publisher: 'Signet Classic', publishedYear: 1949 },
  { title: 'The Alchemist', author: 'Paulo Coelho', isbn: '978-0062315007', category: 'Fiction', description: 'A philosophical novel about following your dreams.', totalCopies: 3, availableCopies: 3, publisher: 'HarperOne', publishedYear: 1988 },
  { title: 'Brave New World', author: 'Aldous Huxley', isbn: '978-0060850524', category: 'Fiction', description: 'A dystopian novel set in a futuristic World State.', totalCopies: 4, availableCopies: 4, publisher: 'Harper Perennial', publishedYear: 1932 },
  { title: 'The Catcher in the Rye', author: 'J.D. Salinger', isbn: '978-0316769174', category: 'Fiction', description: 'A story of teenage alienation and loss of innocence.', totalCopies: 3, availableCopies: 3, publisher: 'Little, Brown', publishedYear: 1951 },
  { title: 'Harry Potter and the Sorcerers Stone', author: 'J.K. Rowling', isbn: '978-0439708180', category: 'Fiction', description: 'A young boy discovers he is a wizard.', totalCopies: 5, availableCopies: 5, publisher: 'Scholastic', publishedYear: 1997 },
  { title: 'The Hobbit', author: 'J.R.R. Tolkien', isbn: '978-0547928227', category: 'Fiction', description: 'A hobbit goes on an unexpected adventure.', totalCopies: 4, availableCopies: 4, publisher: 'Houghton Mifflin', publishedYear: 1937 },
  { title: 'Pride and Prejudice', author: 'Jane Austen', isbn: '978-0141439518', category: 'Fiction', description: 'A romantic novel of manners set in rural England.', totalCopies: 3, availableCopies: 3, publisher: 'Penguin Classics', publishedYear: 1813 },
  { title: 'The Lord of the Rings', author: 'J.R.R. Tolkien', isbn: '978-0544003415', category: 'Fiction', description: 'An epic high-fantasy novel.', totalCopies: 3, availableCopies: 3, publisher: 'Houghton Mifflin', publishedYear: 1954 },

  // Technology
  { title: 'Clean Code', author: 'Robert C. Martin', isbn: '978-0132350884', category: 'Technology', description: 'A handbook of agile software craftsmanship.', totalCopies: 2, availableCopies: 2, publisher: 'Prentice Hall', publishedYear: 2008 },
  { title: 'The Pragmatic Programmer', author: 'Andrew Hunt', isbn: '978-0135957059', category: 'Technology', description: 'Your journey to mastery.', totalCopies: 2, availableCopies: 2, publisher: 'Addison-Wesley', publishedYear: 2019 },
  { title: 'Introduction to Algorithms', author: 'Thomas H. Cormen', isbn: '978-0262033848', category: 'Technology', description: 'Comprehensive introduction to algorithms.', totalCopies: 2, availableCopies: 2, publisher: 'MIT Press', publishedYear: 2009 },
  { title: 'Design Patterns', author: 'Gang of Four', isbn: '978-0201633610', category: 'Technology', description: 'Elements of reusable object-oriented software.', totalCopies: 2, availableCopies: 2, publisher: 'Addison-Wesley', publishedYear: 1994 },
  { title: 'You Dont Know JS', author: 'Kyle Simpson', isbn: '978-1491924464', category: 'Technology', description: 'A deep dive into the JavaScript language.', totalCopies: 3, availableCopies: 3, publisher: 'O Reilly Media', publishedYear: 2015 },
  { title: 'The Phoenix Project', author: 'Gene Kim', isbn: '978-1942788294', category: 'Technology', description: 'A novel about IT, DevOps, and helping your business win.', totalCopies: 2, availableCopies: 2, publisher: 'IT Revolution Press', publishedYear: 2013 },
  { title: 'Structure and Interpretation of Computer Programs', author: 'Harold Abelson', isbn: '978-0262510875', category: 'Technology', description: 'A foundational text in computer science.', totalCopies: 2, availableCopies: 2, publisher: 'MIT Press', publishedYear: 1996 },

  // Science
  { title: 'A Brief History of Time', author: 'Stephen Hawking', isbn: '978-0553380163', category: 'Science', description: 'An exploration of cosmology and the nature of the universe.', totalCopies: 3, availableCopies: 3, publisher: 'Bantam Books', publishedYear: 1988 },
  { title: 'The Selfish Gene', author: 'Richard Dawkins', isbn: '978-0198788607', category: 'Science', description: 'A gene-centred view of evolution.', totalCopies: 2, availableCopies: 2, publisher: 'Oxford University Press', publishedYear: 1976 },
  { title: 'Cosmos', author: 'Carl Sagan', isbn: '978-0345539434', category: 'Science', description: 'A personal voyage through the universe.', totalCopies: 3, availableCopies: 3, publisher: 'Ballantine Books', publishedYear: 1980 },
  { title: 'The Gene', author: 'Siddhartha Mukherjee', isbn: '978-1476733500', category: 'Science', description: 'An intimate history of genetics.', totalCopies: 2, availableCopies: 2, publisher: 'Scribner', publishedYear: 2016 },

  // History
  { title: 'Sapiens', author: 'Yuval Noah Harari', isbn: '978-0062316097', category: 'History', description: 'A brief history of humankind.', totalCopies: 3, availableCopies: 3, publisher: 'Harper', publishedYear: 2015 },
  { title: 'Guns Germs and Steel', author: 'Jared Diamond', isbn: '978-0393354324', category: 'History', description: 'The fates of human societies.', totalCopies: 2, availableCopies: 2, publisher: 'W. W. Norton', publishedYear: 1997 },
  { title: 'The Diary of a Young Girl', author: 'Anne Frank', isbn: '978-0553296983', category: 'History', description: 'The diary of Anne Frank during WWII.', totalCopies: 4, availableCopies: 4, publisher: 'Bantam Books', publishedYear: 1947 },
  { title: 'Homo Deus', author: 'Yuval Noah Harari', isbn: '978-0062464316', category: 'History', description: 'A brief history of tomorrow.', totalCopies: 3, availableCopies: 3, publisher: 'Harper', publishedYear: 2017 },

  // Self-Help
  { title: 'Atomic Habits', author: 'James Clear', isbn: '978-0735211292', category: 'Self-Help', description: 'An easy and proven way to build good habits.', totalCopies: 4, availableCopies: 4, publisher: 'Avery', publishedYear: 2018 },
  { title: 'The 7 Habits of Highly Effective People', author: 'Stephen R. Covey', isbn: '978-1982137274', category: 'Self-Help', description: 'Powerful lessons in personal change.', totalCopies: 3, availableCopies: 3, publisher: 'Simon and Schuster', publishedYear: 1989 },
  { title: 'Deep Work', author: 'Cal Newport', isbn: '978-1455586691', category: 'Self-Help', description: 'Rules for focused success in a distracted world.', totalCopies: 3, availableCopies: 3, publisher: 'Grand Central Publishing', publishedYear: 2016 },
  { title: 'Rich Dad Poor Dad', author: 'Robert T. Kiyosaki', isbn: '978-1612680194', category: 'Self-Help', description: 'What the rich teach their kids about money.', totalCopies: 4, availableCopies: 4, publisher: 'Plata Publishing', publishedYear: 1997 },

  // Psychology
  { title: 'Thinking, Fast and Slow', author: 'Daniel Kahneman', isbn: '978-0374533557', category: 'Psychology', description: 'Explores the two systems that drive the way we think.', totalCopies: 2, availableCopies: 2, publisher: 'Farrar, Straus and Giroux', publishedYear: 2011 },
  { title: 'Mans Search for Meaning', author: 'Viktor E. Frankl', isbn: '978-0807014271', category: 'Psychology', description: 'A psychiatrists experiences in Nazi concentration camps.', totalCopies: 3, availableCopies: 3, publisher: 'Beacon Press', publishedYear: 1946 },
  { title: 'Influence', author: 'Robert B. Cialdini', isbn: '978-0062937650', category: 'Psychology', description: 'The psychology of persuasion.', totalCopies: 2, availableCopies: 2, publisher: 'Harper Business', publishedYear: 1984 },

  // Business
  { title: 'Zero to One', author: 'Peter Thiel', isbn: '978-0804139021', category: 'Business', description: 'Notes on startups, or how to build the future.', totalCopies: 3, availableCopies: 3, publisher: 'Crown Business', publishedYear: 2014 },
  { title: 'Good to Great', author: 'Jim Collins', isbn: '978-0066620992', category: 'Business', description: 'Why some companies make the leap and others dont.', totalCopies: 2, availableCopies: 2, publisher: 'HarperBusiness', publishedYear: 2001 },
  { title: 'The Lean Startup', author: 'Eric Ries', isbn: '978-0307887894', category: 'Business', description: 'How today entrepreneurs use continuous innovation.', totalCopies: 3, availableCopies: 3, publisher: 'Crown Business', publishedYear: 2011 },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  await User.deleteMany({});
  await Book.deleteMany({});

  const adminPassword = await bcrypt.hash('admin123', 10);
  const userPassword = await bcrypt.hash('user123', 10);

  await User.create([
    { name: 'Admin User', email: 'admin@library.com', password: adminPassword, role: 'admin', phone: '9999999999' },
    { name: 'John Doe', email: 'john@example.com', password: userPassword, role: 'user', phone: '8888888888' },
    { name: 'Jane Smith', email: 'jane@example.com', password: userPassword, role: 'user', phone: '7777777777' },
  ]);

  await Book.create(books);

  console.log('Seed complete! 35 books added across 7 categories.');
  console.log('Admin: admin@library.com / admin123');
  console.log('User:  john@example.com / user123');
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
