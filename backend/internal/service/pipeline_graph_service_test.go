package service

import (
	"testing"

	"github.com/YASH-SINGH-1807/nexflow/backend/internal/model"
)

func TestWouldCreateCycle_AllowsLinearDAG(
	t *testing.T,
) {
	edges := []model.PipelineEdge{
		{
			SourceNodeID: 1,
			TargetNodeID: 2,
		},
		{
			SourceNodeID: 2,
			TargetNodeID: 3,
		},
	}

	if wouldCreateCycle(
		edges,
		3,
		4,
	) {
		t.Fatal(
			"expected edge 3 -> 4 to be allowed",
		)
	}
}

func TestWouldCreateCycle_RejectsCycle(
	t *testing.T,
) {
	edges := []model.PipelineEdge{
		{
			SourceNodeID: 1,
			TargetNodeID: 2,
		},
		{
			SourceNodeID: 2,
			TargetNodeID: 3,
		},
	}

	if !wouldCreateCycle(
		edges,
		3,
		1,
	) {
		t.Fatal(
			"expected edge 3 -> 1 to create a cycle",
		)
	}
}

func TestWouldCreateCycle_RejectsIndirectCycle(
	t *testing.T,
) {
	edges := []model.PipelineEdge{
		{
			SourceNodeID: 1,
			TargetNodeID: 2,
		},
		{
			SourceNodeID: 2,
			TargetNodeID: 3,
		},
		{
			SourceNodeID: 3,
			TargetNodeID: 4,
		},
	}

	if !wouldCreateCycle(
		edges,
		4,
		2,
	) {
		t.Fatal(
			"expected edge 4 -> 2 to create an indirect cycle",
		)
	}
}

func TestWouldCreateCycle_AllowsDisconnectedBranches(
	t *testing.T,
) {
	edges := []model.PipelineEdge{
		{
			SourceNodeID: 1,
			TargetNodeID: 2,
		},
		{
			SourceNodeID: 3,
			TargetNodeID: 4,
		},
	}

	if wouldCreateCycle(
		edges,
		2,
		3,
	) {
		t.Fatal(
			"expected edge 2 -> 3 to be allowed",
		)
	}
}

func TestWouldCreateCycle_EmptyGraph(
	t *testing.T,
) {
	edges := []model.PipelineEdge{}

	if wouldCreateCycle(
		edges,
		1,
		2,
	) {
		t.Fatal(
			"expected first edge to be allowed",
		)
	}
}

func TestWouldCreateCycle_DuplicateEdgeDoesNotCreateCycle(
	t *testing.T,
) {
	edges := []model.PipelineEdge{
		{
			SourceNodeID: 1,
			TargetNodeID: 2,
		},
	}

	if wouldCreateCycle(
		edges,
		1,
		2,
	) {
		t.Fatal(
			"expected duplicate direction not to be classified as a cycle",
		)
	}
}
