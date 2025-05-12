
import React, { createContext, useContext, useState, useEffect } from "react";
import { TitleType, CategoryType } from "@/components/TitleCard";

export interface Title {
  id: string;
  name: string;
  type: TitleType;
  category: CategoryType;
  rating: number;
  image: string;
  deleted: boolean;
}

interface TitlesContextType {
  titles: Title[];
  addTitle: (title: Omit<Title, "id" | "deleted">) => void;
  updateTitle: (id: string, title: Partial<Title>) => void;
  deleteTitle: (id: string) => void;
  restoreTitle: (id: string) => void;
  permanentlyDeleteTitle: (id: string) => void;
  getTitleById: (id: string) => Title | undefined;
}

const TitlesContext = createContext<TitlesContextType | undefined>(undefined);

const demoTitles: Title[] = [
  {
    id: "1",
    name: "Stranger Things",
    type: "série",
    category: "ficção",
    rating: 4.8,
    image: "https://picsum.photos/id/1/500/300",
    deleted: false,
  },
  {
    id: "2",
    name: "O Rei Leão",
    type: "filme",
    category: "animação",
    rating: 4.9,
    image: "https://picsum.photos/id/2/500/300",
    deleted: false,
  },
  {
    id: "3",
    name: "Pantanal",
    type: "novela",
    category: "drama",
    rating: 4.2,
    image: "https://picsum.photos/id/3/500/300",
    deleted: false,
  },
  {
    id: "4",
    name: "A Culpa é das Estrelas",
    type: "filme",
    category: "romance",
    rating: 4.5,
    image: "https://picsum.photos/id/4/500/300",
    deleted: false,
  },
  {
    id: "5",
    name: "Invocação do Mal",
    type: "filme",
    category: "terror",
    rating: 4.3,
    image: "https://picsum.photos/id/5/500/300",
    deleted: false,
  },
  {
    id: "6",
    name: "Brooklyn Nine-Nine",
    type: "série",
    category: "comédia",
    rating: 4.7,
    image: "https://picsum.photos/id/6/500/300",
    deleted: false,
  },
  {
    id: "7",
    name: "A Casa do Dragão",
    type: "série",
    category: "ficção",
    rating: 4.6,
    image: "https://picsum.photos/id/7/500/300",
    deleted: false,
  },
  {
    id: "8",
    name: "Avenida Brasil",
    type: "novela",
    category: "drama",
    rating: 4.4,
    image: "https://picsum.photos/id/8/500/300",
    deleted: false,
  }
];

export const TitlesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [titles, setTitles] = useState<Title[]>(() => {
    const savedTitles = localStorage.getItem('titles');
    return savedTitles ? JSON.parse(savedTitles) : demoTitles;
  });

  useEffect(() => {
    localStorage.setItem('titles', JSON.stringify(titles));
  }, [titles]);

  const addTitle = (title: Omit<Title, "id" | "deleted">) => {
    const newTitle = {
      ...title,
      id: Date.now().toString(),
      deleted: false,
    };
    setTitles([...titles, newTitle]);
  };

  const updateTitle = (id: string, updatedFields: Partial<Title>) => {
    setTitles(
      titles.map((title) =>
        title.id === id ? { ...title, ...updatedFields } : title
      )
    );
  };

  const deleteTitle = (id: string) => {
    setTitles(
      titles.map((title) =>
        title.id === id ? { ...title, deleted: true } : title
      )
    );
  };

  const restoreTitle = (id: string) => {
    setTitles(
      titles.map((title) =>
        title.id === id ? { ...title, deleted: false } : title
      )
    );
  };

  const permanentlyDeleteTitle = (id: string) => {
    setTitles(titles.filter((title) => title.id !== id));
  };

  const getTitleById = (id: string) => {
    return titles.find((title) => title.id === id);
  };

  return (
    <TitlesContext.Provider
      value={{
        titles,
        addTitle,
        updateTitle,
        deleteTitle,
        restoreTitle,
        permanentlyDeleteTitle,
        getTitleById,
      }}
    >
      {children}
    </TitlesContext.Provider>
  );
};

export const useTitles = () => {
  const context = useContext(TitlesContext);
  if (!context) {
    throw new Error("useTitles must be used within a TitlesProvider");
  }
  return context;
};
