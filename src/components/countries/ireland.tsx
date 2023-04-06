import Image from "next/image";

const Country: React.FC = () => {
  return (
    <>
      <p className="text-lg text-gray-500">
        Welcome to the Emerald Isle, the beautiful country of Ireland! Located
        in the westernmost part of Europe (excluding Iceland), Ireland is an
        island country laying on an island that is divided into two political
        entities: the Republic of Ireland and Northern Ireland, which is part of
        the United Kingdom. The country is known for its stunning landscapes,
        rich cultural heritage, and warm and welcoming people.
      </p>

      <br />

      <Image
        className="absoulte"
        alt=""
        src="/pictures/ireland1.jpg"
        width={1000}
        height={600}
      />
    </>
  );
};

export default Country;
