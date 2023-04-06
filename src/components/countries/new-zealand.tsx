import Image from "next/image";

const Country: React.FC = () => {
  return (
    <>
      <p className="text-lg text-gray-500">
        Welcome to New Zealand, a land of stunning natural beauty and unique
        cultural experiences! New Zealand is a small island nation located in
        the southwestern Pacific Ocean, comprised of two main islands and
        numerous smaller islands. Known for its breathtaking landscapes,
        including snow-capped mountains, pristine beaches, and ancient forests,
        New Zealand has become a popular destination for travelers seeking
        adventure and relaxation.
      </p>

      <br />

      <Image
        className="absoulte"
        alt=""
        src="/pictures/new-zealand1.jpg"
        width={1000}
        height={600}
      />
    </>
  );
};

export default Country;
