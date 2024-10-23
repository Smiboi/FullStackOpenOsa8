import { useQuery } from '@apollo/client'
import { ALL_BOOKS, ALL_GENRES, ALL_BOOKS_IN_GENRE } from '../queries'
import { useState } from 'react'

const Books = (props) => {
  // const books = useQuery(ALL_BOOKS)
  const genres = useQuery(ALL_GENRES)
  // const bookResult = useQuery(ALL_BOOKS)
  const [chosenGenre, setChosenGenre] = useState(null)

  const genreFilterText = chosenGenre === null ? '' : 'in genre ' + chosenGenre
  const variables = chosenGenre === null ? {} : {genre: chosenGenre}
  const allBooksInGenre = useQuery(ALL_BOOKS_IN_GENRE, { variables: variables })

  if (!props.show) {
    return null
  }

  // if (bookResult.loading) {
  //   return <div>loading...</div>;
  // }

  if (allBooksInGenre.loading || genres.loading) {
    return <div>loading...</div>
  }

  // if (!books.data) {
  //   console.log("result:", books);
  //   return <div>no data</div>;
  // }

  // const books = bookResult.data.allBooks || [];

  // if (bookResult.loading) {
  //   return <div>loading...</div>;
  // }

  return (
    <div>
      <h2>books</h2>
      <div>
        <b>{genreFilterText}</b>
      </div>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {allBooksInGenre.data.allBooks.map((b) => (
            <tr key={b.title}>
              <td>{b.title}</td>
              <td>{b.author.name}</td>
              <td>{b.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        {genres.data.allGenres.map(genre => <button key={genre} onClick={() => setChosenGenre(genre)}>{genre}</button>)}
        <button onClick={() => setChosenGenre(null)}>all genres</button>
      </div>
    </div>
  )
  // return (
  //   <div>
  //     <h2>books</h2>
  //     <table>
  //       <tbody>
  //         <tr>
  //           <th></th>
  //           <th>author</th>
  //           <th>published</th>
  //         </tr>
  //         {books.map((b) => (
  //           <tr key={b.title}>
  //             <td>{b.title}</td>
  //             <td>{b.author.name}</td>
  //             <td>{b.published}</td>
  //           </tr>
  //         ))}
  //       </tbody>
  //     </table>
  //   </div>
  // )
}

export default Books
