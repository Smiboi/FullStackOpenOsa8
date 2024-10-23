import { useQuery } from '@apollo/client'
import { ALL_BOOKS, ME } from '../queries'

const Recommend = (props) => {
  const books = useQuery(ALL_BOOKS)
  const me = useQuery(ME)

  if (!props.show) {
    return null
  }

  if (books.loading || me.loading) {
    return <div>loading...</div>
  }

  const favGenre = me.data.me.favoriteGenre
  const favBooks = [...books.data.allBooks.filter(b => b.genres.includes(favGenre))]

  return (
    <div>
      <h2>recommendations</h2>
      <div>
        books in your favorite genre <b>{favGenre}</b>
      </div>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {favBooks.map((b) => (
            <tr key={b.title}>
              <td>{b.title}</td>
              <td>{b.author.name}</td>
              <td>{b.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Recommend
