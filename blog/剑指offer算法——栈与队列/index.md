---
title: 剑指offer算法题——栈与队列
date: 2018-2-25 16:14:19
categories:
- 面试
tags: 面试, 算法
path: /offer-stack-queue/
---
## 用两个栈实现队列

>题目描述：用两个栈来实现一个队列，完成队列的Push和Pop操作。 队列中的元素为int类型。



```c++
#include<iostream>
#include<stack>
using namespace std;

class Solution
{
public:
    void push(int node) {
        stack1.push(node);
    }

    int pop() {
        if(stack2.size() == 0)
        {
            if(stack1.size() == 0)
            {
                return -1;
            }
            // 检测stack2中是否有值，如有直接弹出，否则将stack1的值全部弹出到stack2
            while(stack1.size() != 0)
            {
                int tmp = stack1.top();
                stack2.push(tmp);
                stack1.pop();
            }
        }
        int tmp = stack2.top();
        stack2.pop();
        return tmp;
    }

private:
    stack<int> stack1;
    stack<int> stack2;
};


int main()
{
    Solution s;
    s.push(1);
    s.push(2);
    cout<<s.pop();
    s.push(3);
    s.push(5);
    cout<<s.pop();
    cout<<s.pop();
    cout<<s.pop();
    cout<<s.pop();
    return 0;
}
```
