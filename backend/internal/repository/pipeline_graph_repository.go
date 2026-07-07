package repository

import (
	"github.com/YASH-SINGH-1807/nexflow/backend/internal/database"
	"github.com/YASH-SINGH-1807/nexflow/backend/internal/model"
)

type PipelineGraphRepository struct{}

func NewPipelineGraphRepository() *PipelineGraphRepository {
	return &PipelineGraphRepository{}
}

func (r *PipelineGraphRepository) PipelineBelongsToUser(
	pipelineID uint,
	userID uint,
) (bool, error) {
	var count int64

	err := database.DB.
		Model(&model.Pipeline{}).
		Joins(
			"JOIN workspaces ON workspaces.id = pipelines.workspace_id",
		).
		Where(
			"pipelines.id = ? AND workspaces.user_id = ?",
			pipelineID,
			userID,
		).
		Count(&count).
		Error

	if err != nil {
		return false, err
	}

	return count > 0, nil
}

func (r *PipelineGraphRepository) CreateNode(
	node *model.PipelineNode,
) error {
	return database.DB.
		Create(node).
		Error
}

func (r *PipelineGraphRepository) GetNodesByPipelineID(
	pipelineID uint,
) ([]model.PipelineNode, error) {
	var nodes []model.PipelineNode

	err := database.DB.
		Where(
			"pipeline_id = ?",
			pipelineID,
		).
		Order("id ASC").
		Find(&nodes).
		Error

	return nodes, err
}

func (r *PipelineGraphRepository) DeleteNode(
	nodeID uint,
	pipelineID uint,
) (bool, error) {
	result := database.DB.
		Where(
			"id = ? AND pipeline_id = ?",
			nodeID,
			pipelineID,
		).
		Delete(&model.PipelineNode{})

	if result.Error != nil {
		return false, result.Error
	}

	return result.RowsAffected > 0, nil
}

func (r *PipelineGraphRepository) NodesBelongToPipeline(
	pipelineID uint,
	sourceNodeID uint,
	targetNodeID uint,
) (bool, error) {
	var count int64

	err := database.DB.
		Model(&model.PipelineNode{}).
		Where(
			"pipeline_id = ? AND id IN ?",
			pipelineID,
			[]uint{
				sourceNodeID,
				targetNodeID,
			},
		).
		Count(&count).
		Error

	if err != nil {
		return false, err
	}

	return count == 2, nil
}

func (r *PipelineGraphRepository) CreateEdge(
	edge *model.PipelineEdge,
) error {
	return database.DB.
		Create(edge).
		Error
}

func (r *PipelineGraphRepository) GetEdgesByPipelineID(
	pipelineID uint,
) ([]model.PipelineEdge, error) {
	var edges []model.PipelineEdge

	err := database.DB.
		Where(
			"pipeline_id = ?",
			pipelineID,
		).
		Order("id ASC").
		Find(&edges).
		Error

	return edges, err
}

func (r *PipelineGraphRepository) DeleteEdge(
	edgeID uint,
	pipelineID uint,
) (bool, error) {
	result := database.DB.
		Where(
			"id = ? AND pipeline_id = ?",
			edgeID,
			pipelineID,
		).
		Delete(&model.PipelineEdge{})

	if result.Error != nil {
		return false, result.Error
	}

	return result.RowsAffected > 0, nil
}
