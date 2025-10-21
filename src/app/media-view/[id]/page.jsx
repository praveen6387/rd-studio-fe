import MediaViewIndex from "@/components/media-view";
import { getExternalMediaById } from "@/lib/api/client/media/urls";

export default async function MediaView({ params }) {
  const { id } = await params;

  const media = await getExternalMediaById(id);

  return <MediaViewIndex mediaId={id} media={media} />;
}
