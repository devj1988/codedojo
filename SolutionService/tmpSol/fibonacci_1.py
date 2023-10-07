class Solution:
    def fibonacci(self, n):
        if n == 1:
            return 0
        if n == 2:
            return 1
        return self.fibonacci(n-1) + self.fibonacci(n-2)

# class Solution:
#     def fibonacci(self, n):
#         print("ssss")
#         if n == 1 or n == 2:
#             return 1
#         return self.fibonacci(n-1) + self.fibonacci(n-2)