class Node(object):
    def __init__(self, val):
        self.val = val
        self.next = None

    @staticmethod
    def equals(head1, head2):
        if not head1 and not head2:
            return True
        if not head1 or not head2:
            return False
        p1 = head1
        p2 = head2
        while p1 and p2:
            if p1.val != p2.val:
                return False
            p1 = p1.next
            p2 = p2.next
        if p1 or p2:
            return False
        return True
    
    @staticmethod
    def equals_list(head, l):
        if head is None and (l is None or len(l) == 0):
            return True
        p = head
        for el in l:
            if not p or el != p.val:
                return False
            p = p.next
        if p:
            return False
        return True
    
    @staticmethod
    def print_list(head):
        if not head:
            print("[]")
            return
        print("[", end="")
        p = head
        while p:
            el = p.val
            if not p.next:
                print(str(el) + "]")
            else:
                print(el, end=",")
            p = p.next

    @staticmethod
    def convert_to_list_string(head):
        if not head:
            return "[]"
        ret = "["
        p = head
        while p:
            el = p.val
            if not p.next:
                ret += str(el) + "]"
            else:
                ret += str(el) + ", "
            p = p.next
        return ret

    # create Linked List for given list
    @staticmethod
    def create(l):
        if not isinstance(l, list):
            raise Exception("cannot create Linked List from non-list input")
        if len(l) == 0:
            return None
        head = Node(l[0])
        p = head
        for i in l[1:]:
            p.next = Node(i)
            p = p.next
        return head