package pipelinegraph

import (
	"errors"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"

	"github.com/YASH-SINGH-1807/nexflow/backend/internal/dto"
	"github.com/YASH-SINGH-1807/nexflow/backend/internal/model"
	"github.com/YASH-SINGH-1807/nexflow/backend/internal/response"
	"github.com/YASH-SINGH-1807/nexflow/backend/internal/service"
)

var graphService = service.NewPipelineGraphService()

func getUserID(
	c *gin.Context,
) (uint, bool) {
	userIDValue, exists :=
		c.Get("userID")

	if !exists {
		response.Unauthorized(
			c,
			"Unauthorized",
		)
		return 0, false
	}

	userID, ok :=
		userIDValue.(uint)

	if !ok {
		response.Unauthorized(
			c,
			"Unauthorized",
		)
		return 0, false
	}

	return userID, true
}

func parseID(
	c *gin.Context,
	paramName string,
	errorMessage string,
) (uint, bool) {
	id64, err := strconv.ParseUint(
		c.Param(paramName),
		10,
		64,
	)

	if err != nil || id64 == 0 {
		response.BadRequest(
			c,
			errorMessage,
			nil,
		)
		return 0, false
	}

	return uint(id64), true
}

func CreateNode(c *gin.Context) {
	pipelineID, ok := parseID(
		c,
		"id",
		"Invalid pipeline ID",
	)

	if !ok {
		return
	}

	userID, ok := getUserID(c)

	if !ok {
		return
	}

	var req dto.CreatePipelineNodeRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(
			c,
			"Invalid request",
			err.Error(),
		)
		return
	}

	config := req.Config

	if config == "" {
		config = "{}"
	}

	node := &model.PipelineNode{
		PipelineID: pipelineID,
		Name:       req.Name,
		Type:       req.Type,
		Config:     config,
		PositionX:  req.PositionX,
		PositionY:  req.PositionY,
	}

	err := graphService.CreateNode(
		node,
		userID,
	)

	if errors.Is(
		err,
		service.ErrGraphPipelineNotFound,
	) {
		response.Error(
			c,
			http.StatusNotFound,
			"Pipeline not found or access denied",
			nil,
		)
		return
	}

	if err != nil {
		response.InternalServerError(
			c,
			"Unable to create pipeline node",
		)
		return
	}

	response.Created(
		c,
		"Pipeline node created successfully",
		node,
	)
}

func GetGraph(c *gin.Context) {
	pipelineID, ok := parseID(
		c,
		"id",
		"Invalid pipeline ID",
	)

	if !ok {
		return
	}

	userID, ok := getUserID(c)

	if !ok {
		return
	}

	nodes, edges, err :=
		graphService.GetGraph(
			pipelineID,
			userID,
		)

	if errors.Is(
		err,
		service.ErrGraphPipelineNotFound,
	) {
		response.Error(
			c,
			http.StatusNotFound,
			"Pipeline not found or access denied",
			nil,
		)
		return
	}

	if err != nil {
		response.InternalServerError(
			c,
			"Unable to fetch pipeline graph",
		)
		return
	}

	response.OK(
		c,
		"Pipeline graph fetched successfully",
		gin.H{
			"nodes": nodes,
			"edges": edges,
		},
	)
}

func DeleteNode(c *gin.Context) {
	pipelineID, ok := parseID(
		c,
		"id",
		"Invalid pipeline ID",
	)

	if !ok {
		return
	}

	nodeID, ok := parseID(
		c,
		"nodeId",
		"Invalid node ID",
	)

	if !ok {
		return
	}

	userID, ok := getUserID(c)

	if !ok {
		return
	}

	err := graphService.DeleteNode(
		pipelineID,
		nodeID,
		userID,
	)

	if errors.Is(
		err,
		service.ErrGraphPipelineNotFound,
	) {
		response.Error(
			c,
			http.StatusNotFound,
			"Pipeline not found or access denied",
			nil,
		)
		return
	}

	if errors.Is(
		err,
		service.ErrGraphNodeNotFound,
	) {
		response.Error(
			c,
			http.StatusNotFound,
			"Pipeline node not found",
			nil,
		)
		return
	}

	if err != nil {
		response.InternalServerError(
			c,
			"Unable to delete pipeline node",
		)
		return
	}

	response.OK(
		c,
		"Pipeline node deleted successfully",
		nil,
	)
}

func CreateEdge(c *gin.Context) {
	pipelineID, ok := parseID(
		c,
		"id",
		"Invalid pipeline ID",
	)

	if !ok {
		return
	}

	userID, ok := getUserID(c)

	if !ok {
		return
	}

	var req dto.CreatePipelineEdgeRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(
			c,
			"Invalid request",
			err.Error(),
		)
		return
	}

	edge := &model.PipelineEdge{
		PipelineID:   pipelineID,
		SourceNodeID: req.SourceNodeID,
		TargetNodeID: req.TargetNodeID,
	}

	err := graphService.CreateEdge(
		edge,
		userID,
	)

	switch {
	case errors.Is(
		err,
		service.ErrGraphPipelineNotFound,
	):
		response.Error(
			c,
			http.StatusNotFound,
			"Pipeline not found or access denied",
			nil,
		)

	case errors.Is(
		err,
		service.ErrGraphSelfLoop,
	):
		response.BadRequest(
			c,
			"A node cannot connect to itself",
			nil,
		)

	case errors.Is(
		err,
		service.ErrGraphInvalidNodes,
	):
		response.BadRequest(
			c,
			"Source or target node does not belong to this pipeline",
			nil,
		)

	case errors.Is(
		err,
		service.ErrGraphCycleDetected,
	):
		response.BadRequest(
			c,
			"Edge would create a pipeline cycle",
			nil,
		)

	case errors.Is(
		err,
		service.ErrGraphDuplicateEdge,
	):
		response.Error(
			c,
			http.StatusConflict,
			"Edge already exists",
			nil,
		)

	case err != nil:
		response.InternalServerError(
			c,
			"Unable to create pipeline edge",
		)

	default:
		response.Created(
			c,
			"Pipeline edge created successfully",
			edge,
		)
	}
}

func DeleteEdge(c *gin.Context) {
	pipelineID, ok := parseID(
		c,
		"id",
		"Invalid pipeline ID",
	)

	if !ok {
		return
	}

	edgeID, ok := parseID(
		c,
		"edgeId",
		"Invalid edge ID",
	)

	if !ok {
		return
	}

	userID, ok := getUserID(c)

	if !ok {
		return
	}

	err := graphService.DeleteEdge(
		pipelineID,
		edgeID,
		userID,
	)

	if errors.Is(
		err,
		service.ErrGraphPipelineNotFound,
	) {
		response.Error(
			c,
			http.StatusNotFound,
			"Pipeline not found or access denied",
			nil,
		)
		return
	}

	if errors.Is(
		err,
		service.ErrGraphEdgeNotFound,
	) {
		response.Error(
			c,
			http.StatusNotFound,
			"Pipeline edge not found",
			nil,
		)
		return
	}

	if err != nil {
		response.InternalServerError(
			c,
			"Unable to delete pipeline edge",
		)
		return
	}

	response.OK(
		c,
		"Pipeline edge deleted successfully",
		nil,
	)
}
