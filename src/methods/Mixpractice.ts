import type { Practicequestion } from "@/interfaces/Practicequestion";

export default function mixpractice(setpracticetext: React.Dispatch<React.SetStateAction<Practicequestion[]>> ) {

    setpracticetext((prev: any) => {
        const shuffleArray = (arr: any) => {
            const arrayCopy = [...arr];
            for (let i = arrayCopy.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [arrayCopy[i], arrayCopy[j]] = [arrayCopy[j], arrayCopy[i]];
            }
            return arrayCopy;
        };

        const withShuffledOptions = prev.map((item: any) => ({
            ...item,
            options: Array.isArray(item.options) ? shuffleArray(item.options) : item.options,
        }));

        return shuffleArray(withShuffledOptions);
    });

}