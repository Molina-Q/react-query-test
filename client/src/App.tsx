import { useQuery, useMutation, useQueryClient, InvalidateQueryFilters } from '@tanstack/react-query'

const POSTS = [
  { id: "1", title: 'Post 1' },
  { id: "2", title: 'Post 2' },
  { id: "3", title: 'Post 3' },
]

// /posts -> ["posts"]
// /posts/1 -> ["posts", post.id]
// /posts?authorId=1 -> ["posts", { authorId: 1}]
// /posts/2/comments -> ["posts", post.id, "comments"]


function App() {
  const queryClient = useQueryClient();
  const postsQuery = useQuery({
    queryKey: ["posts"],
    queryFn: obj =>
      wait(1000).then(() => {
        console.log(obj);

        return [...POSTS]
      }),
  });

  const newPostMutation = useMutation({
    mutationFn: (title: string) => {
      return wait(1000).then(() =>
        POSTS.push({ id: crypto.randomUUID(), title })
      )
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] })
    },
  })

  if (postsQuery.isLoading) return <h1>Loading</h1>
  if (postsQuery.isError) return <h1>{JSON.stringify(postsQuery.error)}</h1>

  return (
    <div>
      {postsQuery.data?.map(post => (
        <div key={post.id}>
          {post.title}
        </div>
      ))}
      <button
        onClick={() => newPostMutation.mutate('New Post')}
        disabled={newPostMutation.isPending}
      >
        Add new
      </button>
    </div>
  )
}

function wait(duration: number) {
  return new Promise(resolve => setTimeout(resolve, duration))
}

export default App
