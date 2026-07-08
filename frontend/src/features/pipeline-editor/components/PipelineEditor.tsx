import PipelineCanvas from "./PipelineCanvas";

interface PipelineEditorProps {
  pipelineId: number;
}

export default function PipelineEditor({
  pipelineId,
}: PipelineEditorProps) {
  return (
    <div
      className="
        h-[700px]
        w-full
        p-6
      "
    >
      <PipelineCanvas
        pipelineId={pipelineId}
      />
    </div>
  );
}