
import React from "react";
import { useTitles } from "@/contexts/TitlesContext";
import { Button } from "@/components/ui/button";
import { ArrowUp, Trash as TrashIcon } from "lucide-react";
import { toast } from "sonner";

const TrashPage: React.FC = () => {
  const {
    titles,
    restoreTitle,
    permanentlyDeleteTitle
  } = useTitles();
  const deletedTitles = titles.filter(title => title.deleted);

  const handleRestore = (id: string) => {
    restoreTitle(id);
    toast.success("Título restaurado com sucesso");
  };

  const handlePermanentDelete = (id: string) => {
    permanentlyDeleteTitle(id);
    toast.success("Título excluído permanentemente");
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="max-w-md mx-auto p-6 my-8 border border-border rounded-lg">
        {deletedTitles.length === 0 ? (
          <div className="text-center py-10">
            <h3 className="text-xl font-medium text-muted-foreground mb-4">
              Sua lixeira está vazia
            </h3>
            <p className="text-muted-foreground">
              Os títulos excluídos aparecerão aqui
            </p>
          </div>
        ) : (
          <div className="bg-transparent">
            <div className="mb-6">
              <h1 className="text-2xl font-bold">Títulos na lixeira: {deletedTitles.length}</h1>
              <p className="text-gray-400 text-sm">
                Gerencie os títulos que foram excluídos
              </p>
            </div>
            <div className="divide-y divide-border">
              {deletedTitles.map(title => (
                <div key={title.id} className="flex items-center justify-between py-4 hover:bg-muted/50">
                  <div className="flex items-center gap-3">
                    <img src={title.image || "/placeholder.svg"} alt={title.name} className="h-12 w-12 rounded-md object-cover" />
                    <div>
                      <h4 className="font-medium">{title.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {title.type} • {title.category}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleRestore(title.id)}>
                      <ArrowUp className="h-4 w-4 mr-1" />
                      Restaurar
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handlePermanentDelete(title.id)}>
                      <TrashIcon className="h-4 w-4 mr-1" />
                      Excluir
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrashPage;
