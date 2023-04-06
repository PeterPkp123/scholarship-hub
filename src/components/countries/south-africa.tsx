import Image from "next/image";

const Country: React.FC = () => {
  return (
    <>
      <p className="text-lg text-gray-500">
        Welcome to South Africa, a country known for its stunning landscapes,
        diverse cultures, and incredible wildlife. Located at the southern tip
        of the African continent, South Africa is bordered by the Indian and
        Atlantic oceans, Namibia, Botswana, Zimbabwe, Mozambique as well as
        Lesotho and Eswatini.
      </p>

      <br />

      <Image
        className="absoulte"
        alt=""
        src="/pictures/south-africa1.jpg"
        width={1000}
        height={600}
      />
    </>
  );
};

export default Country;
