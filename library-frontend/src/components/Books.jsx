import { useQuery } from '@apollo/client'
import { ALL_BOOKS } from '../queries'

const Books = (props) => {
  const books = useQuery(ALL_BOOKS)
  // const bookResult = useQuery(ALL_BOOKS)

  if (!props.show) {
    return null
  }

  // if (bookResult.loading) {
  //   return <div>loading...</div>;
  // }

  if (books.loading) {
    return <div>loading...</div>;
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
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.data.allBooks.map((b) => (
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
