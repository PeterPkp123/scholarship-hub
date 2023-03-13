export const useAudioPlayer = () => {
  const play = async (url: string) => {
    const audio = new Audio(url);

    await audio.play();
  };

  return { play };
};
