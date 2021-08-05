import { useState } from 'react';
import { StrapiPost } from '../../pages/posts';
import { Button } from '../Button';
import { TextInput } from '../TextInput';

export type FormPostProps = {
  onSave?: (post: StrapiPost) => Promise<void>;
  post?: StrapiPost;
};

export const FormPost = ({ post, onSave }: FormPostProps) => {
  const { title = '', content = '', id = '' } = post || {};
  const [newTitle, setNewTitle] = useState(title);
  const [newContent, setNewContent] = useState(content);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    setIsLoading(true);
    event.preventDefault();

    const newPost = { id, title: newTitle, content: newContent };

    if (onSave) {
      await onSave(newPost);
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextInput
        name="post-title"
        label="Post title"
        value={newTitle}
        onInputChange={(v) => setNewTitle(v)}
      />
      <TextInput
        name="post-content"
        label="Post content"
        value={newContent}
        onInputChange={(v) => setNewContent(v)}
        as="textarea"
      />
      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Salvando...' : 'Salvar'}
      </Button>
    </form>
  );
};
