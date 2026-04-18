import useCms from "../hooks/useCms.js";

function Footer() {

  const { get } = useCms("global");

  const footer = get("footer");

  return (
    <footer className="p-10 bg-gray-100">

      <h2>{footer?.title}</h2>
      <p>{footer?.description}</p>

      <p>{footer?.data?.phone}</p>
      <p>{footer?.data?.email}</p>

    </footer>
  );
}

export default Footer;