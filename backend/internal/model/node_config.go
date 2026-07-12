package model

type SourceConnectionType string

const (
	SourcePostgreSQL SourceConnectionType = "postgresql"
	SourceMySQL      SourceConnectionType = "mysql"
	SourceCSV        SourceConnectionType = "csv"
	SourceRESTAPI    SourceConnectionType = "rest-api"
)

type SourceNodeConfig struct {
	ConnectionType SourceConnectionType `json:"connectionType"`

	Host     string `json:"host,omitempty"`
	Port     int    `json:"port,omitempty"`
	Database string `json:"database,omitempty"`
	Username string `json:"username,omitempty"`
	Password string `json:"password,omitempty"`

	Query string `json:"query,omitempty"`

	FilePath string `json:"filePath,omitempty"`

	URL    string `json:"url,omitempty"`
	Method string `json:"method,omitempty"`
}

type TransformOperation string

const (
	TransformFilter    TransformOperation = "filter"
	TransformMap       TransformOperation = "map"
	TransformAggregate TransformOperation = "aggregate"
	TransformSort      TransformOperation = "sort"
)

type TransformNodeConfig struct {
	Operation TransformOperation `json:"operation"`

	Expression string   `json:"expression,omitempty"`
	GroupBy    []string `json:"groupBy,omitempty"`

	SortField     string `json:"sortField,omitempty"`
	SortDirection string `json:"sortDirection,omitempty"`
}

type DestinationType string

const (
	DestinationPostgreSQL DestinationType = "postgresql"
	DestinationMySQL      DestinationType = "mysql"
	DestinationCSV        DestinationType = "csv"
	DestinationRESTAPI    DestinationType = "rest-api"
)

type DestinationNodeConfig struct {
	DestinationType DestinationType `json:"destinationType"`

	Host     string `json:"host,omitempty"`
	Port     int    `json:"port,omitempty"`
	Database string `json:"database,omitempty"`
	Table    string `json:"table,omitempty"`

	FilePath string `json:"filePath,omitempty"`

	URL    string `json:"url,omitempty"`
	Method string `json:"method,omitempty"`
}
