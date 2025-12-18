import { useEffect, useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { CommunityCard } from "@/components/community/CommunityCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Plus, TrendingUp, Users, MessageSquare } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { listCommunities, createCommunity, type Community } from "@/api/community";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function Communities() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const { user } = useUser();
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [openCreate, setOpenCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newTags, setNewTags] = useState("");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    
    const fetchCommunities = async () => {
      try {
        setLoading(true);
        const data = await listCommunities();
        if (!mounted) return;
        setCommunities(Array.isArray(data) ? data : []);
      } catch (e) {
        if (!mounted) return;
        setError("Não foi possível carregar as comunidades.");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchCommunities();
    
    return () => { mounted = false; };
  }, []);

  const allTags = Array.from(
    new Set((communities || []).flatMap((community: Community) => community.tags || []))
  ).sort();

  const filteredCommunities: Community[] = (communities || []).filter((community: Community) => {
    const matchesSearch = community.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (community.description || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = !selectedTag || (community.tags || []).includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  const joinedCommunities: Community[] = (communities || []).filter((community: Community) => 
    user?.communities.includes(community.name)
  );

  const suggestedCommunities: Community[] = (communities || []).filter((community: Community) => 
    !user?.communities.includes(community.name)
  );

  return (
    <MainLayout>
      <div className="space-y-4 sm:space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl font-bold gradient-text">Comunidades</h1>
            <p className="text-muted-foreground text-sm">
              Encontre espaços para reflexão e discussão consciente
            </p>
          </div>
          <Button 
            className="flex items-center gap-2 bg-gradient-to-r from-primary to-secondary hover:opacity-90" 
            onClick={() => setOpenCreate(true)}
          >
            <Plus className="h-4 w-4" />
            <span>Criar comunidade</span>
          </Button>
        </div>

        <Dialog open={openCreate} onOpenChange={setOpenCreate}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nova comunidade</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="community-name">Nome</Label>
                <Input id="community-name" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Ex: Minimalismo Digital" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="community-desc">Descrição</Label>
                <Textarea id="community-desc" value={newDescription} onChange={(e) => setNewDescription(e.target.value)} placeholder="Sobre o propósito da comunidade" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="community-tags">Tags (separadas por vírgula)</Label>
                <Input id="community-tags" value={newTags} onChange={(e) => setNewTags(e.target.value)} placeholder="ex: tecnologia, bem-estar" />
              </div>
              {createError && (
                <div className="text-sm text-destructive">{createError}</div>
              )}
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setOpenCreate(false);
                }}
                disabled={creating}
              >
                Cancelar
              </Button>
              <Button
                onClick={async () => {
                  try {
                    setCreateError(null);
                    if (!newName.trim()) {
                      setCreateError("Informe um nome para a comunidade.");
                      return;
                    }
                    setCreating(true);
                    const tags = newTags
                      .split(',')
                      .map(t => t.trim())
                      .filter(Boolean);
                    const created = await createCommunity({ name: newName.trim(), description: newDescription.trim() || undefined, tags: tags.length ? tags : undefined });
                    setCommunities(prev => [created, ...prev]);
                    setNewName("");
                    setNewDescription("");
                    setNewTags("");
                    setOpenCreate(false);
                  } catch (e) {
                    setCreateError("Não foi possível criar a comunidade.");
                  } finally {
                    setCreating(false);
                  }
                }}
                disabled={creating}
              >
                {creating ? "Criando..." : "Criar"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Loading / Error */}
        {loading && (
          <Card>
            <CardContent className="p-4">Carregando comunidades...</CardContent>
          </Card>
        )}
        {!loading && error && (
          <Card>
            <CardContent className="p-4 text-destructive">{error}</CardContent>
          </Card>
        )}

        {/* Search and Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Explorar comunidades</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar comunidades..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Filtrar por temas:</label>
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant={selectedTag === "" ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setSelectedTag("")}
                >
                  Todos
                </Badge>
                {allTags.map(tag => (
                  <Badge
                    key={tag}
                    variant={selectedTag === tag ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setSelectedTag(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Overview */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          <Card className="glass-card">
            <CardContent className="p-3 sm:p-4 text-center">
              <Users className="h-5 w-5 sm:h-8 sm:w-8 text-primary mx-auto mb-1 sm:mb-2" />
              <div className="text-lg sm:text-2xl font-bold">
                {communities.reduce((sum: number, c: Community) => sum + (c.membersCount ?? 0), 0)}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">membros</div>
            </CardContent>
          </Card>
          
          <Card className="glass-card">
            <CardContent className="p-3 sm:p-4 text-center">
              <MessageSquare className="h-5 w-5 sm:h-8 sm:w-8 text-primary mx-auto mb-1 sm:mb-2" />
              <div className="text-lg sm:text-2xl font-bold">
                {communities.reduce((sum: number, c: Community) => sum + (c.discussionsCount ?? 0), 0)}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">respostas</div>
            </CardContent>
          </Card>
          
          <Card className="glass-card">
            <CardContent className="p-3 sm:p-4 text-center">
              <TrendingUp className="h-5 w-5 sm:h-8 sm:w-8 text-primary mx-auto mb-1 sm:mb-2" />
              <div className="text-lg sm:text-2xl font-bold">
                {communities.reduce((sum: number, c: Community) => sum + (c.postsCount ?? 0), 0)}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">reflexões</div>
            </CardContent>
          </Card>
        </div>

        {/* Joined Communities */}
        {joinedCommunities.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Suas comunidades</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {joinedCommunities.map((community, index) => (
                <CommunityCard
                  key={index}
                  name={community.name}
                  description={community.description || ""}
                  memberCount={community.membersCount ?? 0}
                  activeDiscussions={community.discussionsCount ?? 0}
                  topicsThisWeek={community.postsCount ?? 0}
                  tags={community.tags || []}
                  featured={community.featured}
                  to={`/communities/${community.id}`}
                />
              ))}
            </div>
          </div>
        )}

        {/* All/Suggested Communities */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">
            {user ? "Descobrir novas comunidades" : "Todas as comunidades"}
          </h2>
          
          {filteredCommunities.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">
                  Nenhuma comunidade encontrada com os filtros aplicados.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredCommunities.map((community: Community, index: number) => (
                <CommunityCard
                  key={index}
                  name={community.name}
                  description={community.description || ""}
                  memberCount={community.membersCount ?? 0}
                  activeDiscussions={community.discussionsCount ?? 0}
                  topicsThisWeek={community.postsCount ?? 0}
                  tags={community.tags || []}
                  featured={community.featured}
                  to={`/communities/${community.id}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}