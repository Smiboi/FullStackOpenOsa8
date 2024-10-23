const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()

const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')
const Book = require('./models/book')
const Author = require('./models/author')
const User = require('./models/user')

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      const books = await Book.find({})
      return books
        .filter((book) => (args.author ? book.author.name === args.author : true))
        .filter((book) => (args.genre ? book.genres.includes(args.genre) : true))

      // const books = await Book.find({})
      // return books.filter((book) => (args.genre ? book.genres.includes(args.genre) : true));

      // const byGenre = (book) =>
      //   !args.genre || Book.collection.find({ genres: args.genre }) ? 
      // return Book.find({})

      // filters missing
      // const byAuthor = (book) =>
      //   !args.author || args.author === book.author ? book : !book
      // const byGenre = (book) =>
      //   !args.genre || book.genres.find(p => p === args.genre) ? book : !book
      // return books.filter(byAuthor).filter(byGenre)
    },
    allAuthors: async () => {
      return Author.find({})
    },
    allGenres: async () => {
      const books = await Book.find({})
      return Array.from(new Set(books.map(b => b.genres).flat()))
    },
    me: (root, args, context) => {
      return context.currentUser
    }
  },
  Author: {
    bookCount: async (root) => {
      const books = await Book.find({}).populate('author')
      return books.reduce((amount, book) => book.author.name === root.name ? amount + 1 : amount, 0)
      // let bookCount = 0
      // for (let i = 0; i < books.length; i++) {
      //   if (root.name === books[i].author) {
      //     bookCount++
      //   }
      // }
      // return bookCount
    }
  },
  Book: {
    author: async (root) => {
      const authorFound = await Author.findById(root.author)
      return authorFound
    }
  },
  Mutation: {
    addBook: async (root, args, context) => {
      const author = await Author.findOne({ name: args.author })
      const book = await new Book({ author: author, title: args.title, published: args.published, genres: args.genres })
      const currentUser = context.currentUser

      if (!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT',
          }
        })
      }
  
      try {
        await book.save()
      } catch (error) {
        throw new GraphQLError('Adding book failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
            error
          }
        })
      }

      pubsub.publish('BOOK_ADDED', { bookAdded: book })

      return book

      // if (!authors.find(p => p.name === args.author)) {
      //   const author = { name: args.author, id: uuid() }
      //   authors = authors.concat(author)
      // }
      // const book = { ...args, id: uuid() }
      // books = books.concat(book)
      // return book
    },
    editAuthor: async (root, args, context) => {
      const author = await Author.findOne({ name: args.name })
      author.born = args.setBornTo
      const currentUser = context.currentUser

      if (!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT',
          }
        })
      }

      try {
        await author.save()
      } catch (error) {
        throw new GraphQLError('Editing author failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
            error
          }
        })
      }

      return author
    },
    createUser: async (root, args) => {
      const user = new User({ username: args.username, favoriteGenre: args.favoriteGenre })
  
      return user.save()
        .catch(error => {
          throw new GraphQLError('Creating the user failed', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.username,
              error
            }
          })
        })
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })
  
      if ( !user || args.password !== 'secret' ) {
        throw new GraphQLError('wrong credentials', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })        
      }
  
      const userForToken = {
        username: user.username,
        id: user._id,
      }
  
      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
    },
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator('BOOK_ADDED')
    },
  },
}

module.exports = resolvers
