import Image from "next/image";

const Country: React.FC = () => {
  return (
    <>
      <p className="text-lg text-gray-500">
        Welcome to the beautiful city-state of Singapore, an island nation
        located in Southeast Asia, known for its breathtaking skyline, delicious
        cuisine, and rich cultural heritage. This tiny island country is
        situated at the southern tip of the Malay Peninsula, with Indonesia to
        the south and Malaysia to the north. Singapore is made up of one main
        island and 63 surrounding ones, and has a total land area of just 728.6
        square kilometers. Despite its small size, Singapore is one of the
        world&apos;s most prosperous countries, with a thriving economy and a
        high standard of living.
      </p>

      <br />

      <Image
        className="absoulte"
        alt=""
        src="/pictures/singapore1.jpg"
        width={1000}
        height={600}
      />
    </>
  );
};

export default Country;
