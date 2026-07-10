import {
  useEffect,
  useState,
  type FormEvent,
} from "react";

import type {
  PipelineNode,
} from "@/features/pipeline/api/pipelineGraphApi";

import SourceNodeConfigForm from "./config/SourceNodeConfigForm";

import TransformNodeConfigForm from "./config/TransformNodeConfigForm";

import DestinationNodeConfigForm from "./config/DestinationNodeConfigForm";

import type {
  DestinationNodeConfig,
  SourceNodeConfig,
  TransformNodeConfig,
} from "../types/nodeConfig";

import {
  parseNodeConfig,
  serializeNodeConfig,
} from "../utils/nodeConfig";


interface NodeConfigPanelProps {
  node: PipelineNode;
  isSaving: boolean;

  onSave: (data: {
    name: string;
    config: string;
  }) => void;

  onClose: () => void;
}

export default function NodeConfigPanel({
  node,
  isSaving,
  onSave,
  onClose,
}: NodeConfigPanelProps) {
  const [name, setName] =
    useState(node.name);

  const [config, setConfig] =
    useState(node.config || "{}");

  const [, setConfigError] =
  useState<string | null>(null);

  const parsedSourceConfig =
    node.type === "source"
      ? parseNodeConfig<SourceNodeConfig>(
          config
        )
      : null;

  const sourceConfig: SourceNodeConfig =
    parsedSourceConfig ?? {
      connectionType: "postgresql",
    };

    const parsedTransformConfig =
  node.type === "transform"
    ? parseNodeConfig<TransformNodeConfig>(
        config
      )
    : null;

const transformConfig: TransformNodeConfig =
  parsedTransformConfig ?? {
    operation: "filter",
  };

  const parsedDestinationConfig =
  node.type === "destination"
    ? parseNodeConfig<DestinationNodeConfig>(
        config
      )
    : null;

const destinationConfig: DestinationNodeConfig =
  parsedDestinationConfig ?? {
    destinationType: "postgresql",
  };

  useEffect(() => {
    setName(node.name);
    setConfig(node.config || "{}");
    setConfigError(null);
  }, [node]);

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const normalizedConfig =
      config.trim() || "{}";

    try {
      JSON.parse(normalizedConfig);
      setConfigError(null);
    } catch {
      setConfigError(
        "Configuration must be valid JSON."
      );
      return;
    }

    onSave({
      name: name.trim(),
      config: normalizedConfig,
    });
  };

  return (
    <aside
      className="
        w-full
        rounded-3xl
        border
        border-slate-200
        bg-white
        p-5
        shadow-lg
        lg:w-[360px]
      "
    >
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
            Node Configuration
          </p>

          <h2 className="mt-1 text-lg font-bold text-slate-900">
            {node.name}
          </h2>

          <p className="mt-1 text-sm capitalize text-slate-500">
            {node.type} node
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="
            rounded-lg
            px-3
            py-1.5
            text-sm
            font-semibold
            text-slate-500
            transition
            hover:bg-slate-100
            hover:text-slate-800
          "
        >
          Close
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        <div>
          <label
            htmlFor="node-name"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Node Name
          </label>

          <input
            id="node-name"
            value={name}
            onChange={(event) =>
              setName(event.target.value)
            }
            maxLength={150}
            required
            className="
              w-full
              rounded-xl
              border
              border-slate-200
              px-3
              py-2.5
              text-sm
              text-slate-900
              outline-none
              transition
              focus:border-blue-400
              focus:ring-4
              focus:ring-blue-50
            "
          />
        </div>

        {node.type === "source" && (
          <SourceNodeConfigForm
            value={sourceConfig}
            onChange={(nextConfig) => {
              setConfig(
                serializeNodeConfig(
                  nextConfig
                )
              );

              setConfigError(null);
            }}
          />
        )}

        {node.type === "transform" && (
  <TransformNodeConfigForm
    value={transformConfig}
    onChange={(nextConfig) => {
      setConfig(
        serializeNodeConfig(
          nextConfig
        )
      );

      setConfigError(null);
    }}
  />
)}

{node.type === "destination" && (
  <DestinationNodeConfigForm
    value={destinationConfig}
    onChange={(nextConfig) => {
      setConfig(
        serializeNodeConfig(
          nextConfig
        )
      );

      setConfigError(null);
    }}
  />
)}


        <button
          type="submit"
          disabled={
            isSaving ||
            name.trim().length === 0
          }
          className="
            w-full
            rounded-xl
            bg-blue-600
            px-4
            py-3
            text-sm
            font-bold
            text-white
            transition
            hover:bg-blue-700
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          {isSaving
            ? "Saving..."
            : "Save Changes"}
        </button>
      </form>
    </aside>
  );
}