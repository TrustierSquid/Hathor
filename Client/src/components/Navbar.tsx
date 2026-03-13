import { useData } from "../context/UserDataContext"

export default function Navbar(){
  let data = useData()

  console.log(data)
  
  return (
    <nav id="navbar">
      <h2>Wolf Bookmarks</h2>

      <div id="userInformationElement">
        <img className="profilePicture" src="./src/assets/images/defaultProfilePicture.png" alt="picture" />
        <h3>User</h3>
      </div>
    </nav>
  )
}