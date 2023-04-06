import Image from "next/image";

const Country: React.FC = () => {
  return (
    <>
      <p className="text-lg text-gray-500">
        Welcome to the United Kingdom, a country that is steeped in history,
        culture and tradition! The UK is located off the northwest coast of
        Europe, comprising four countries - England, Scotland, Wales, and
        Northern Ireland. The country is known for its diverse landscapes,
        ranging from rolling hills and picturesque countryside to bustling
        cities and interesting coastlines.
      </p>

      <br />

      <Image
        className="absoulte"
        alt=""
        src="/pictures/united-kingdom1.jpg"
        width={1000}
        height={600}
      />
    </>
  );
};

export default Country;
