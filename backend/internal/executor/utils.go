package executor

import "fmt"

func toString(v any) string {
	if v == nil {
		return ""
	}
	return fmt.Sprint(v)
}
