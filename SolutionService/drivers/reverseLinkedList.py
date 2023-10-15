class Solution(object):
    def reverse(self, root):
        if root is None or root.next is None:
            return root
        p = root
        rest = None
        # n = [100]*10000000000
        while p:
            temp = p.next
            p.next = rest
            rest = p
            p = temp
        return rest