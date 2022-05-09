import axios from "axios";
import Users from "../components/users";
import { baseUrl } from "../proxy";
export default function Home(props) {
  return (
    <div style={{ padding: "2rem" }}>
      <h3>User CRUD</h3>
      <Users users={props.data} />
    </div>
  );
}

export async function getServerSideProps() {
  const res = await axios.get(`${baseUrl}/api/users/`);
  const data = res.data.users.map((el) => {
    el.id = el._id;
    delete el._id;
    return el;
  });
  // Pass data to the page via props
  return { props: { data } };
}
