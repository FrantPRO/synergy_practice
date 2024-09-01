CXX = g++
CXXFLAGS = -std=c++11 -Wall -Iinclude

SRCS = src/main.cpp src/Task.cpp src/TaskList.cpp
OBJS = $(SRCS:.cpp=.o)

EXEC = task_manager

all: $(EXEC)

$(EXEC): $(OBJS)
	$(CXX) $(CXXFLAGS) -o $(EXEC) $(OBJS)

clean:
	rm -f $(OBJS) $(EXEC)
